import request from 'supertest'
import {
  createAnswer,
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Comment on answer (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[POST] /answers/:answerId/comments', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })
    const answer = await createAnswer(ctx, {
      authorId: student.id,
      questionId: question.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .post(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'New comment' })

    expect(response.statusCode).toBe(201)
    expect(
      await ctx.prisma.comment.findFirst({ where: { content: 'New comment' } }),
    ).toEqual(expect.objectContaining({ answerId: answer.id.toString() }))
  })
})
