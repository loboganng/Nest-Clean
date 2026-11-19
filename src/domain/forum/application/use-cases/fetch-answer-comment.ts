import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

// Para ficar um pouco mais organizado, criamos uma interface que vai receber os atributos
interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

//  Creating a response type for the answer
type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

// A partir dessa interface, utilizamos ela para recuperar os atributos da classe alvo
export class FetchAnswerCommentsUseCase {
  // Injetando a dependência do repositório aqui
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  // Usamos desestruturação pra recuperar os atributos
  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return right({
      answerComments,
    })
  }
}
