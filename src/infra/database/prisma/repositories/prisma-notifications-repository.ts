import { Injectable } from '@nestjs/common'
import {
  PaginationParams,
  PER_PAGE,
} from '@/core/repositories/pagination-params'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    })

    return notification ? PrismaNotificationMapper.toDomain(notification) : null
  }

  async findManyByRecipientId(
    recipientId: string,
    { page }: PaginationParams,
  ): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: 'desc' },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    })

    return notifications.map(PrismaNotificationMapper.toDomain)
  }

  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    })
  }

  async save(notification: Notification): Promise<void> {
    await this.prisma.notification.update({
      where: { id: notification.id.toString() },
      data: PrismaNotificationMapper.toPrisma(notification),
    })
  }
}
