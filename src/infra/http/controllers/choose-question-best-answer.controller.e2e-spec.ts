import request from 'supertest'
import {
  createAnswer,
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Choose question best answer (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[PATCH] /answers/:answerId/choose-as-best', async () => {
    const { student: author, accessToken } = await createStudent(ctx)
    const { student: answerer } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: author.id })
    const answer = await createAnswer(ctx, {
      authorId: answerer.id,
      questionId: question.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .patch(`/answers/${answer.id.toString()}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await ctx.prisma.question.findUnique({
      where: { id: question.id.toString() },
    })
    expect(questionOnDatabase?.bestAnswerId).toBe(answer.id.toString())
  })

  test('[PATCH] /answers/:answerId/choose-as-best by someone who is not the question author', async () => {
    const { student: author } = await createStudent(ctx)
    const { accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: author.id })
    const answer = await createAnswer(ctx, {
      authorId: author.id,
      questionId: question.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .patch(`/answers/${answer.id.toString()}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
