import request from 'supertest'
import { createStudent, createTestApp, TestContext } from 'test/e2e/helpers'

import { hash } from 'bcryptjs'

describe('Create account (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[POST] /accounts', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)

    const user = await ctx.prisma.user.findUnique({
      where: { email: 'johndoe@example.com' },
    })
    expect(user).toBeTruthy()
    expect(user?.password).not.toBe('123456')
  })

  test('[POST] /accounts with an e-mail already in use', async () => {
    await createStudent(ctx, {
      email: 'taken@example.com',
      password: await hash('123456', 8),
    })

    const response = await request(ctx.app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'Jane Doe',
        email: 'taken@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(409)
  })

  test('[POST] /accounts with an invalid body', async () => {
    const response = await request(ctx.app.getHttpServer())
      .post('/accounts')
      .send({ name: 'John Doe', email: 'not-an-email', password: '123' })

    expect(response.statusCode).toBe(400)
  })
})
