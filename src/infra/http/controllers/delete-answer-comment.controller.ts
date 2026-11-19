import { Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { useCaseErrorToHttp } from '../errors/use-case-error-to-http'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const result = await this.deleteAnswerComment.execute({
      authorId: user.sub,
      answerCommentId,
    })

    if (result.isLeft()) {
      throw useCaseErrorToHttp(result.value)
    }
  }
}
