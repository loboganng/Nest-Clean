import request from 'supertest'
import {
  createAnswer,
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

/** Polls an async assertion until it passes (domain events are fire and forget). */
async function eventually(assertion: () => Promise<void>, timeout = 3000) {
  const start = Date.now()

  for (;;) {
    try {
      await assertion()
      return
    } catch (error) {
      if (Date.now() - start > timeout) throw error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

describe('Domain events -> notifications (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  it('notifies the question author when a new answer is created', async () => {
    const { student: author } = await createStudent(ctx)
    const { accessToken: answererToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: author.id })

    await request(ctx.app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${answererToken}`)
      .send({ content: 'An answer' })
      .expect(201)

    await eventually(async () => {
      const notification = await ctx.prisma.notification.findFirst({
        where: { recipientId: author.id.toString() },
      })
      expect(notification?.title).toContain('New answer')
    })
  })

  it('notifies the answer author when the answer is chosen as the best', async () => {
    const { student: author, accessToken } = await createStudent(ctx)
    const { student: answerer } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: author.id })
    const answer = await createAnswer(ctx, {
      authorId: answerer.id,
      questionId: question.id,
    })

    await request(ctx.app.getHttpServer())
      .patch(`/answers/${answer.id.toString()}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204)

    await eventually(async () => {
      const notification = await ctx.prisma.notification.findFirst({
        where: { recipientId: answerer.id.toString() },
      })
      expect(notification?.title).toBe('Your answer was chosen!')
    })
  })
})
