import request from 'supertest'
import {
  createNotification,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Fetch notifications (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[GET] /notifications', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const { student: someoneElse } = await createStudent(ctx)

    await createNotification(ctx, { recipientId: student.id, title: 'Mine' })
    await createNotification(ctx, {
      recipientId: someoneElse.id,
      title: 'Not mine',
    })

    const response = await request(ctx.app.getHttpServer())
      .get('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.notifications).toEqual([
      expect.objectContaining({ title: 'Mine', readAt: null }),
    ])
  })
})
