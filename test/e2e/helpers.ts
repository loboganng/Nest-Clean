import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { AnswerCommentProps } from '@/domain/forum/enterprise/entities/answer-comment'
import { QuestionProps } from '@/domain/forum/enterprise/entities/question'
import { QuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment'
import { StudentProps } from '@/domain/forum/enterprise/entities/student'
import { NotificationProps } from '@/domain/notification/enterprise/entities/notification'
import { AppModule } from '@/infra/app.module'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { makeAnswer } from '../factories/make-answer'
import { makeAnswerComment } from '../factories/make-answer-comment'
import { makeNotification } from '../factories/make-notification'
import { makeQuestion } from '../factories/make-question'
import { makeQuestionComment } from '../factories/make-question-comment'
import { makeStudent } from '../factories/make-student'

export interface TestContext {
  app: INestApplication
  prisma: PrismaService
  jwt: JwtService
}

export async function createTestApp(): Promise<TestContext> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleRef.createNestApplication()
  await app.init()

  return {
    app,
    prisma: moduleRef.get(PrismaService, { strict: false }),
    jwt: moduleRef.get(JwtService),
  }
}

/**
 * Persistence helpers: build an entity with the domain factory and store it
 * through the same mapper the real repositories use.
 */
export async function createStudent(
  { prisma, jwt }: TestContext,
  override: Partial<StudentProps> = {},
) {
  const student = makeStudent(override)
  await prisma.user.create({ data: PrismaStudentMapper.toPrisma(student) })

  const accessToken = jwt.sign({ sub: student.id.toString() })

  return { student, accessToken }
}

export async function createQuestion(
  { prisma }: TestContext,
  override: Partial<QuestionProps> = {},
) {
  const question = makeQuestion(override)
  await prisma.question.create({
    data: PrismaQuestionMapper.toPrisma(question),
  })

  return question
}

export async function createAnswer(
  { prisma }: TestContext,
  override: Partial<AnswerProps> = {},
): Promise<Answer> {
  // Passing an id makes it a persisted answer, so no AnswerCreatedEvent is
  // queued for an answer the API never created.
  const answer = makeAnswer(override, new UniqueEntityId())
  await prisma.answer.create({ data: PrismaAnswerMapper.toPrisma(answer) })

  return answer
}

export async function createQuestionComment(
  { prisma }: TestContext,
  override: Partial<QuestionCommentProps> = {},
) {
  const comment = makeQuestionComment(override)
  await prisma.comment.create({
    data: PrismaQuestionCommentMapper.toPrisma(comment),
  })

  return comment
}

export async function createAnswerComment(
  { prisma }: TestContext,
  override: Partial<AnswerCommentProps> = {},
) {
  const comment = makeAnswerComment(override)
  await prisma.comment.create({
    data: PrismaAnswerCommentMapper.toPrisma(comment),
  })

  return comment
}

export async function createNotification(
  { prisma }: TestContext,
  override: Partial<NotificationProps> = {},
) {
  const notification = makeNotification(override)
  await prisma.notification.create({
    data: PrismaNotificationMapper.toPrisma(notification),
  })

  return notification
}
