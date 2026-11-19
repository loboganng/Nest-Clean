import { Injectable } from '@nestjs/common'
import {
  PaginationParams,
  PER_PAGE,
} from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const comment = await this.prisma.comment.findFirst({
      where: { id, questionId: { not: null } },
    })

    return comment ? PrismaQuestionCommentMapper.toDomain(comment) : null
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    })

    return comments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async create(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: questionComment.id.toString() },
    })
  }
}
