import { InjectionToken, Provider } from '@nestjs/common'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comment'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { FetchRecipientNotificationsUseCase } from '@/domain/notification/application/use-cases/fetch-recipient-notifications'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

type UseCaseClass = new (...deps: any[]) => object

/**
 * Builds a Nest provider for a plain domain use case. The use case class
 * itself is the DI token, and its dependencies are the abstract repository /
 * cryptography classes. This keeps @Injectable() (and Nest as a whole) out of
 * the domain layer.
 */
function useCase(cls: UseCaseClass, deps: InjectionToken[]): Provider {
  return {
    provide: cls,
    useFactory: (...resolved: unknown[]) => new cls(...resolved),
    inject: deps,
  }
}

export const useCaseProviders: Provider[] = [
  // Accounts
  useCase(RegisterStudentUseCase, [StudentsRepository, HashGenerator]),
  useCase(AuthenticateStudentUseCase, [
    StudentsRepository,
    HashComparer,
    Encrypter,
  ]),

  // Questions
  useCase(CreateQuestionUseCase, [QuestionsRepository]),
  useCase(FetchRecentQuestionsUseCase, [QuestionsRepository]),
  useCase(GetQuestionBySlugUseCase, [QuestionsRepository]),
  useCase(EditQuestionUseCase, [
    QuestionsRepository,
    QuestionAttachmentRepository,
  ]),
  useCase(DeleteQuestionUseCase, [QuestionsRepository]),

  // Answers
  useCase(AnswerQuestionUseCase, [AnswersRepository]),
  useCase(FetchQuestionAnswersUseCase, [AnswersRepository]),
  useCase(EditAnswerUseCase, [AnswersRepository, AnswerAttachmentRepository]),
  useCase(DeleteAnswerUseCase, [AnswersRepository]),
  useCase(ChooseQuestionBestAnswerUseCase, [
    QuestionsRepository,
    AnswersRepository,
  ]),

  // Comments
  useCase(CommentOnQuestionUseCase, [
    QuestionsRepository,
    QuestionCommentsRepository,
  ]),
  useCase(FetchQuestionCommentsUseCase, [QuestionCommentsRepository]),
  useCase(DeleteQuestionCommentUseCase, [QuestionCommentsRepository]),
  useCase(CommentOnAnswerUseCase, [
    AnswersRepository,
    AnswerCommentsRepository,
  ]),
  useCase(FetchAnswerCommentsUseCase, [AnswerCommentsRepository]),
  useCase(DeleteAnswerCommentUseCase, [AnswerCommentsRepository]),

  // Notifications
  useCase(FetchRecipientNotificationsUseCase, [NotificationsRepository]),
  useCase(ReadNotificationUseCase, [NotificationsRepository]),
]
