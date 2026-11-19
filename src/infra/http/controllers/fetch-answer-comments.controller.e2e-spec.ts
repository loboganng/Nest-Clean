import request from 'supertest'
import {
  createAnswer,
  createAnswerComment,
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Fetch answer comments (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[GET] /answers/:answerId/comments', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })
    const answer = await createAnswer(ctx, {
      authorId: student.id,
      questionId: question.id,
    })

    await createAnswerComment(ctx, {
      authorId: student.id,
      answerId: answer.id,
      content: 'Comment 01',
    })
    await createAnswerComment(ctx, {
      authorId: student.id,
      answerId: answer.id,
      content: 'Comment 02',
    })

    const response = await request(ctx.app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.comments).toHaveLength(2)
  })
})
