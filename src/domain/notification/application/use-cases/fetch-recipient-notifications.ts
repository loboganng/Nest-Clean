import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

interface FetchRecipientNotificationsUseCaseRequest {
  recipientId: string
  page: number
}

type FetchRecipientNotificationsUseCaseResponse = Either<
  null,
  {
    notifications: Notification[]
  }
>

export class FetchRecipientNotificationsUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    page,
  }: FetchRecipientNotificationsUseCaseRequest): Promise<FetchRecipientNotificationsUseCaseResponse> {
    const notifications =
      await this.notificationsRepository.findManyByRecipientId(recipientId, {
        page,
      })

    return right({
      notifications,
    })
  }
}
