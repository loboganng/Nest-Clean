import request from 'supertest'
import {
  createQuestion,
  createQuestionComment,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Fetch question comments (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[GET] /questions/:questionId/comments', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })

    await createQuestionComment(ctx, {
      authorId: student.id,
      questionId: question.id,
      content: 'Comment 01',
    })
    await createQuestionComment(ctx, {
      authorId: student.id,
      questionId: question.id,
      content: 'Comment 02',
    })

    const response = await request(ctx.app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.comments).toHaveLength(2)
    expect(response.body.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: 'Comment 01' }),
        expect.objectContaining({ content: 'Comment 02' }),
      ]),
    )
  })
})
