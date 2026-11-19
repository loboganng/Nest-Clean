import { Module } from '@nestjs/common'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { DatabaseModule } from '../database/database.module'

/**
 * Instantiates the domain subscribers. Their constructors register themselves
 * in DomainEvents, so creating them at bootstrap is enough to wire the
 * Forum -> Notification flow.
 */
@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: SendNotificationUseCase,
      useFactory: (repo: NotificationsRepository) =>
        new SendNotificationUseCase(repo),
      inject: [NotificationsRepository],
    },
    {
      provide: OnAnswerCreated,
      useFactory: (
        questions: QuestionsRepository,
        sendNotification: SendNotificationUseCase,
      ) => new OnAnswerCreated(questions, sendNotification),
      inject: [QuestionsRepository, SendNotificationUseCase],
    },
    {
      provide: OnQuestionBestAnswerChosen,
      useFactory: (
        answers: AnswersRepository,
        sendNotification: SendNotificationUseCase,
      ) => new OnQuestionBestAnswerChosen(answers, sendNotification),
      inject: [AnswersRepository, SendNotificationUseCase],
    },
  ],
})
export class EventsModule {}
