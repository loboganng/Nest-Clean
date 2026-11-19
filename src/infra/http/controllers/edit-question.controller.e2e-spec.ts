import request from 'supertest'
import {
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Edit question (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[PUT] /questions/:id', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: student.id })

    const response = await request(ctx.app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Edited title', content: 'Edited content' })

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await ctx.prisma.question.findUnique({
      where: { id: question.id.toString() },
    })
    expect(questionOnDatabase).toEqual(
      expect.objectContaining({
        title: 'Edited title',
        slug: 'edited-title',
        content: 'Edited content',
      }),
    )
  })

  test('[PUT] /questions/:id by someone who is not the author', async () => {
    const { student: author } = await createStudent(ctx)
    const { accessToken } = await createStudent(ctx)
    const question = await createQuestion(ctx, { authorId: author.id })

    const response = await request(ctx.app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Hijacked', content: 'Hijacked' })

    expect(response.statusCode).toBe(403)
  })
})
