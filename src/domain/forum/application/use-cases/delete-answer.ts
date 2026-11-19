import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

// Para ficar um pouco mais organizado, criamos uma interface que vai receber os atributos
interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

//  Creating a response type for the answer
// As we're deleting a answer, this response will be void
type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

// A partir dessa interface, utilizamos ela para recuperar os atributos da classe alvo
export class DeleteAnswerUseCase {
  // Injetando a dependência do repositório aqui
  constructor(private answersRepository: AnswersRepository) {}

  // Usamos desestruturação pra recuperar os atributos
  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    // If answer not exist
    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    // If person trying to delete is not author
    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return right({})
  }
}
