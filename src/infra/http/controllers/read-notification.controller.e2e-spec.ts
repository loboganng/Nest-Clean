import request from 'supertest'
import {
  createNotification,
  createStudent,
  createTestApp,
  TestContext,
} from 'test/e2e/helpers'

describe('Read notification (E2E)', () => {
  let ctx: TestContext

  beforeAll(async () => {
    ctx = await createTestApp()
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const { student, accessToken } = await createStudent(ctx)
    const notification = await createNotification(ctx, {
      recipientId: student.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const notificationOnDatabase = await ctx.prisma.notification.findUnique({
      where: { id: notification.id.toString() },
    })
    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })

  test('[PATCH] /notifications/:notificationId/read by someone who is not the recipient', async () => {
    const { student } = await createStudent(ctx)
    const { accessToken } = await createStudent(ctx)
    const notification = await createNotification(ctx, {
      recipientId: student.id,
    })

    const response = await request(ctx.app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })
})
