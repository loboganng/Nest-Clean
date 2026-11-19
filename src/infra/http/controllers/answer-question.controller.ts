import { Body, Controller, Param, Post } from '@nestjs/common'
import { z } from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { useCaseErrorToHttp } from '../errors/use-case-error-to-http'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AnswerPresenter } from '../presenters/answer-presenter'

const answerQuestionBodySchema = z.object({
  content: z.string().min(1),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(answerQuestionBodySchema))
    body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.answerQuestion.execute({
      instructorId: user.sub,
      questionId,
      content: body.content,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw useCaseErrorToHttp(result.value)
    }

    return { answer: AnswerPresenter.toHTTP(result.value.answer) }
  }
}
