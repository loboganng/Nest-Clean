import request from 'supertest'
import { createStudent, createTestApp, TestContext } from 'test/e2e/helpers'

import { hash } from 'bcryptjs'

describe('Authenticate (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
    await createStudent(ctx, {
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    })
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[POST] /sessions', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/sessions')
      .send({ email: 'johndoe@example.com', password: '123456' })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ access_token: expect.any(String) })

    // The token is accepted by a protected route.
    const protectedResponse = await request(ctx.app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${response.body.access_token}`)

    expect(protectedResponse.statusCode).toBe(200)
  })

  test('[POST] /sessions with wrong credentials', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/sessions')
      .send({ email: 'johndoe@example.com', password: 'wrong' })

    expect(response.statusCode).toBe(401)
  })

  test('protected route without a token', async () => {
    const response = await request(ctx.app.getHttpServer()).get('/questions')

    expect(response.statusCode).toBe(401)
  })
})
