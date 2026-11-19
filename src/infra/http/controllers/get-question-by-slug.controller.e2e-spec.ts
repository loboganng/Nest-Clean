import request from 'supertest'
import {
  createQuestion,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

describe('Get question by slug (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[GET] /questions/:slug', async () => {
    const { student, accessToken } = await createStudent(ctx)
    await createQuestion(ctx, {
      authorId: student.id,
      title: 'Some question',
      slug: Slug.create('some-question'),
    })

    const response = await request(ctx.app.getHttpServer())
      .get('/questions/some-question')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.question).toEqual(
      expect.objectContaining({
        title: 'Some question',
        slug: 'some-question',
      }),
    )
  })

  test('[GET] /questions/:slug that does not exist', async () => {
    const { accessToken } = await createStudent(ctx)

    const response = await request(ctx.app.getHttpServer())
      .get('/questions/does-not-exist')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })
})
