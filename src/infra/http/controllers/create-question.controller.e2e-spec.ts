import request from 'supertest'
import { createStudent, createTestApp, TestContext } from 'test/e2e/helpers'

describe('Create question (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[POST] /questions', async () => {
    const { accessToken } = await createStudent(ctx)

    const response = await request(ctx.app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'New question', content: 'Question content' })

    expect(response.statusCode).toBe(201)
    expect(response.body.question).toEqual(
      expect.objectContaining({ title: 'New question', slug: 'new-question' }),
    )

    const questionOnDatabase = await ctx.prisma.question.findUnique({
      where: { slug: 'new-question' },
    })
    expect(questionOnDatabase).toBeTruthy()
  })

  test('[POST] /questions with a title that generates an existing slug', async () => {
    const { accessToken } = await createStudent(ctx)

    const response = await request(ctx.app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'New Question!', content: 'Another content' })

    expect(response.statusCode).toBe(409)
  })
})
