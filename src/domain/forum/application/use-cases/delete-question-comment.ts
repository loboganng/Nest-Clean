import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

// Para ficar um pouco mais organizado, criamos uma interface que vai receber os atributos
interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

//  Creating a response type for the answer
type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

// A partir dessa interface, utilizamos ela para recuperar os atributos da classe alvo
export class DeleteQuestionCommentUseCase {
  // Injetando a dependência do repositório aqui
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  // Usamos desestruturação pra recuperar os atributos
  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right({})
  }
}
