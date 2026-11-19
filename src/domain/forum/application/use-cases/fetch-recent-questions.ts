import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

// Para ficar um pouco mais organizado, criamos uma interface que vai receber os atributos
interface FetchRecentQuestionsUseCaseRequest {
  page: number
}

//  Creating a response type for the answer
type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

// A partir dessa interface, utilizamos ela para recuperar os atributos da classe alvo
export class FetchRecentQuestionsUseCase {
  // Injetando a dependência do repositório aqui
  constructor(private questionsRepository: QuestionsRepository) {}

  // Usamos desestruturação pra recuperar os atributos
  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return right({
      questions,
    })
  }
}
