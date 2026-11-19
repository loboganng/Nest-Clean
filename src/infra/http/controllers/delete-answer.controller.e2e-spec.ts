import request from 'supertest'
import {
  createAnswer,
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Delete answer (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[DELETE] /answers/:id', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })
    const answer = await createAnswer(ctx, {
      authorId: student.id,
      questionId: question.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .delete(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
    expect(
      await ctx.prisma.answer.findUnique({
        where: { id: answer.id.toString() },
      }),
    ).toBeNull()
  })

  test('[DELETE] /answers/:id that does not exist', async () => {
    const { accessToken } = await createStudent(ctx)

    const response = await request(ctx.app.getHttpServer())
      .delete('/answers/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })
})
