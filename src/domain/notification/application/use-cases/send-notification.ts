import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

// Para ficar um pouco mais organizado, criamos uma interface que vai receber os atributos
export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

//  Creating a response type for the answer
export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

// A partir dessa interface, utilizamos ela para recuperar os atributos da classe alvo
export class SendNotificationUseCase {
  // Injetando a dependência do repositório aqui
  constructor(private notificationsRepository: NotificationsRepository) {}

  // Usamos desestruturação pra recuperar os atributos
  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    })

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
