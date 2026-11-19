import request from 'supertest'
import {
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Fetch recent questions (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[GET] /questions', async () => {
    const { student, accessToken } = await createStudent(ctx)

    for (let i = 1; i <= 22; i++) {
      await createQuestion(ctx, {
        authorId: student.id,
        title: `Question ${i}`,
        createdAt: new Date(2026, 0, i),
      })
    }

    const firstPage = await request(ctx.app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(firstPage.statusCode).toBe(200)
    expect(firstPage.body.questions).toHaveLength(20)
    expect(firstPage.body.questions[0].title).toBe('Question 22')

    const secondPage = await request(ctx.app.getHttpServer())
      .get('/questions?page=2')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(
      secondPage.body.questions.map((q: { title: string }) => q.title),
    ).toEqual(['Question 2', 'Question 1'])
  })

  test('[GET] /questions with an invalid page', async () => {
    const { accessToken } = await createStudent(ctx)

    const response = await request(ctx.app.getHttpServer())
      .get('/questions?page=0')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(400)
  })
})
