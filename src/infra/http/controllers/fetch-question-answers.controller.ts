import { Controller, Get, Param, Query } from '@nestjs/common'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { useCaseErrorToHttp } from '../errors/use-case-error-to-http'
import {
  PageQueryParam,
  pageQueryValidationPipe,
} from '../pipes/page-query-param'
import { AnswerPresenter } from '../presenters/answer-presenter'

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParam,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswers.execute({ questionId, page })

    if (result.isLeft()) {
      throw useCaseErrorToHttp(result.value)
    }

    return { answers: result.value.answers.map(AnswerPresenter.toHTTP) }
  }
}
