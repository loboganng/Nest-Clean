import request from 'supertest'
import {
  createQuestion,
  createQuestionComment,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Delete question comment (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[DELETE] /questions/comments/:id', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })
    const comment = await createQuestionComment(ctx, {
      authorId: student.id,
      questionId: question.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .delete(`/questions/comments/${comment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
    expect(
      await ctx.prisma.comment.findUnique({
        where: { id: comment.id.toString() },
      }),
    ).toBeNull()
  })

  test('[DELETE] /questions/comments/:id by someone who is not the author', async () => {
    const { student: author } = await createStudent(ctx)
    const { accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: author.id })
    const comment = await createQuestionComment(ctx, {
      authorId: author.id,
      questionId: question.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .delete(`/questions/comments/${comment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
