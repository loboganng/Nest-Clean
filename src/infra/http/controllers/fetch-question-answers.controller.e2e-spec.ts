import request from 'supertest'
import {
  createAnswer,
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Fetch question answers (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })
    const otherQuestion = await createQuestion(ctx, { authorId: student.id })

    await createAnswer(ctx, {
      authorId: student.id,
      questionId: question.id,
      content: 'Answer 01',
    })
    await createAnswer(ctx, {
      authorId: student.id,
      questionId: question.id,
      content: 'Answer 02',
    })
    await createAnswer(ctx, {
      authorId: student.id,
      questionId: otherQuestion.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .get(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.answers).toHaveLength(2)
    expect(response.body.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: 'Answer 01' }),
        expect.objectContaining({ content: 'Answer 02' }),
      ]),
    )
  })
})
