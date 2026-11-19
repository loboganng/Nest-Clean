import { Controller, Get, Param, Query } from '@nestjs/common'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comment'
import { useCaseErrorToHttp } from '../errors/use-case-error-to-http'
import {
  PageQueryParam,
  pageQueryValidationPipe,
} from '../pipes/page-query-param'
import { CommentPresenter } from '../presenters/comment-presenter'

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParam,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({ answerId, page })

    if (result.isLeft()) {
      throw useCaseErrorToHttp(result.value)
    }

    return {
      comments: result.value.answerComments.map(CommentPresenter.toHTTP),
    }
  }
}
