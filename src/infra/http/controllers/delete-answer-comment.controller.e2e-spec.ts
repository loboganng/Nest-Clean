import request from 'supertest'
import {
  createAnswer,
  createAnswerComment,
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Delete answer comment (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[DELETE] /answers/comments/:id', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })
    const answer = await createAnswer(ctx, {
      authorId: student.id,
      questionId: question.id,
    })
    const comment = await createAnswerComment(ctx, {
      authorId: student.id,
      answerId: answer.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .delete(`/answers/comments/${comment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
    expect(
      await ctx.prisma.comment.findUnique({
        where: { id: comment.id.toString() },
      }),
    ).toBeNull()
  })
})
