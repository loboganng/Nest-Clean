import { Controller, Get, Query } from '@nestjs/common'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { useCaseErrorToHttp } from '../errors/use-case-error-to-http'
import {
  PageQueryParam,
  pageQueryValidationPipe,
} from '../pipes/page-query-param'
import { QuestionPresenter } from '../presenters/question-presenter'

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', pageQueryValidationPipe) page: PageQueryParam) {
    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) {
      throw useCaseErrorToHttp(result.value)
    }

    return { questions: result.value.questions.map(QuestionPresenter.toHTTP) }
  }
}
