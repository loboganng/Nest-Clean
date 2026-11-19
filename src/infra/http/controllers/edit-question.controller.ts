import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { z } from 'zod'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { useCaseErrorToHttp } from '../errors/use-case-error-to-http'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editQuestionBodySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editQuestionBodySchema))
    body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const result = await this.editQuestion.execute({
      authorId: user.sub,
      questionId,
      title: body.title,
      content: body.content,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw useCaseErrorToHttp(result.value)
    }
  }
}
