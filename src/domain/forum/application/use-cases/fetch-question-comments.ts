import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

// Para ficar um pouco mais organizado, criamos uma interface que vai receber os atributos
interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

//  Creating a response type for the answer
type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

// A partir dessa interface, utilizamos ela para recuperar os atributos da classe alvo
export class FetchQuestionCommentsUseCase {
  // Injetando a dependência do repositório aqui
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  // Usamos desestruturação pra recuperar os atributos
  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      })

    return right({
      questionComments,
    })
  }
}
