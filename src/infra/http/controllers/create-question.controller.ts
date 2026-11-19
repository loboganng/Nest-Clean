import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { useCaseErrorToHttp } from '../errors/use-case-error-to-http'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { QuestionPresenter } from '../presenters/question-presenter'

const createQuestionBodySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.createQuestion.execute({
      authorId: user.sub,
      title: body.title,
      content: body.content,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw useCaseErrorToHttp(result.value)
    }

    return { question: QuestionPresenter.toHTTP(result.value.question) }
  }
}
