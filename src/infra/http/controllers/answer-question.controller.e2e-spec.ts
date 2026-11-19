import request from 'supertest'
import {
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Answer question (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[POST] /questions/:questionId/answers', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })

    const response = await request(ctx.app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'New answer' })

    expect(response.statusCode).toBe(201)
    expect(response.body.answer).toEqual(
      expect.objectContaining({
        content: 'New answer',
        questionId: question.id.toString(),
      }),
    )
  })

  test('[POST] /questions/:questionId/answers to a question that does not exist', async () => {
    const { accessToken } = await createStudent(ctx)

    const response = await request(ctx.app.getHttpServer())
      .post('/questions/00000000-0000-0000-0000-000000000000/answers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'New answer' })

    expect(response.statusCode).toBe(404)
  })
})
