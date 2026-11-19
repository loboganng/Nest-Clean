import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

// Para ficar um pouco mais organizado, criamos uma interface que vai receber os atributos
interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

//  Creating a response type for the answer
type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

// A partir dessa interface, utilizamos ela para recuperar os atributos da classe alvo
export class ReadNotificationUseCase {
  // Injetando a dependência do repositório aqui
  constructor(private notificationsRepository: NotificationsRepository) {}

  // Usamos desestruturação pra recuperar os atributos
  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    // If answer not exist
    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    // If person trying to delete is not author
    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({
      notification,
    })
  }
}
