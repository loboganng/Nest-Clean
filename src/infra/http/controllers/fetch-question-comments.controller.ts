import { Controller, Get, Param, Query } from '@nestjs/common'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { useCaseErrorToHttp } from '../errors/use-case-error-to-http'
import {
  PageQueryParam,
  pageQueryValidationPipe,
} from '../pipes/page-query-param'
import { CommentPresenter } from '../presenters/comment-presenter'

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParam,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionComments.execute({
      questionId,
      page,
    })

    if (result.isLeft()) {
      throw useCaseErrorToHttp(result.value)
    }

    return {
      comments: result.value.questionComments.map(CommentPresenter.toHTTP),
    }
  }
}
