import { Body, Controller, Param, Post } from '@nestjs/common'
import { z } from 'zod'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { useCaseErrorToHttp } from '../errors/use-case-error-to-http'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CommentPresenter } from '../presenters/comment-presenter'

const commentBodySchema = z.object({
  content: z.string().min(1),
})

type CommentBodySchema = z.infer<typeof commentBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(commentBodySchema)) body: CommentBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.commentOnAnswer.execute({
      authorId: user.sub,
      answerId,
      content: body.content,
    })

    if (result.isLeft()) {
      throw useCaseErrorToHttp(result.value)
    }

    return { comment: CommentPresenter.toHTTP(result.value.answerComment) }
  }
}
