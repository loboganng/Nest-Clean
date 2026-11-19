import request from 'supertest'
import {
  createAnswer,
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Delete question (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[DELETE] /questions/:id', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })
    await createAnswer(ctx, { authorId: student.id, questionId: question.id })

    const response = await request(ctx.app.getHttpServer())
      .delete(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    expect(
      await ctx.prisma.question.findUnique({
        where: { id: question.id.toString() },
      }),
    ).toBeNull()
    // Answers are removed together with the question.
    expect(
      await ctx.prisma.answer.count({
        where: { questionId: question.id.toString() },
      }),
    ).toBe(0)
  })

  test('[DELETE] /questions/:id by someone who is not the author', async () => {
    const { student: author } = await createStudent(ctx)
    const { accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: author.id })

    const response = await request(ctx.app.getHttpServer())
      .delete(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
