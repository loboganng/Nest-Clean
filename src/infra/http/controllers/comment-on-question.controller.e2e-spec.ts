import request from 'supertest'
import {
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Comment on question (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[POST] /questions/:questionId/comments', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })

    const response = await request(ctx.app.getHttpServer())
      .post(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'New comment' })

    expect(response.statusCode).toBe(201)
    expect(
      await ctx.prisma.comment.findFirst({ where: { content: 'New comment' } }),
    ).toEqual(expect.objectContaining({ questionId: question.id.toString() }))
  })

  test('[POST] /questions/:questionId/comments on a question that does not exist', async () => {
    const { accessToken } = await createStudent(ctx)

    const response = await request(ctx.app.getHttpServer())
      .post('/questions/00000000-0000-0000-0000-000000000000/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'New comment' })

    expect(response.statusCode).toBe(404)
  })
})
