import request from 'supertest'
import {
  createAnswer,
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Edit answer (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[PUT] /answers/:id', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })
    const answer = await createAnswer(ctx, {
      authorId: student.id,
      questionId: question.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .put(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'Edited answer' })

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await ctx.prisma.answer.findUnique({
      where: { id: answer.id.toString() },
    })
    expect(answerOnDatabase?.content).toBe('Edited answer')
  })

  test('[PUT] /answers/:id by someone who is not the author', async () => {
    const { student: author } = await createStudent(ctx)
    const { accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: author.id })
    const answer = await createAnswer(ctx, {
      authorId: author.id,
      questionId: question.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .put(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'Hijacked' })

    expect(response.statusCode).toBe(403)
  })
})
