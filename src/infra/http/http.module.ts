import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller'
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller'
import { CommentOnQuestionController } from './controllers/comment-on-question.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { EditAnswerController } from './controllers/edit-answer.controller'
import { EditQuestionController } from './controllers/edit-question.controller'
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller'
import { FetchNotificationsController } from './controllers/fetch-notifications.controller'
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller'
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { ReadNotificationController } from './controllers/read-notification.controller'
import { PrismaErrorFilter } from './errors/prisma-error.filter'
import { useCaseProviders } from './use-cases.providers'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AnswerQuestionController,
    AuthenticateController,
    ChooseQuestionBestAnswerController,
    CommentOnAnswerController,
    CommentOnQuestionController,
    CreateAccountController,
    CreateQuestionController,
    DeleteAnswerCommentController,
    DeleteAnswerController,
    DeleteQuestionCommentController,
    DeleteQuestionController,
    EditAnswerController,
    EditQuestionController,
    FetchAnswerCommentsController,
    FetchNotificationsController,
    FetchQuestionAnswersController,
    FetchQuestionCommentsController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    ReadNotificationController,
  ],
  providers: [
    ...useCaseProviders,
    { provide: APP_FILTER, useClass: PrismaErrorFilter },
  ],
})
export class HttpModule {}
