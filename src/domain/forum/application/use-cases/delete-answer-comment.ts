import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

// Para ficar um pouco mais organizado, criamos uma interface que vai receber os atributos
interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

//  Creating a response type for the answer
type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

// A partir dessa interface, utilizamos ela para recuperar os atributos da classe alvo
export class DeleteAnswerCommentUseCase {
  // Injetando a dependência do repositório aqui
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  // Usamos desestruturação pra recuperar os atributos
  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right({})
  }
}
