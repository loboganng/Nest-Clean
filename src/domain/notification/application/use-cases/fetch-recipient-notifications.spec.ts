import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { FetchRecipientNotificationsUseCase } from './fetch-recipient-notifications'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: FetchRecipientNotificationsUseCase

describe('Fetch recipient notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new FetchRecipientNotificationsUseCase(
      inMemoryNotificationsRepository,
    )
  })

  it('should fetch only the notifications of the recipient, newest first', async () => {
    const recipientId = new UniqueEntityId('recipient-1')

    inMemoryNotificationsRepository.items.push(
      makeNotification({ recipientId, createdAt: new Date(2026, 0, 1) }),
      makeNotification({ recipientId, createdAt: new Date(2026, 0, 3) }),
      makeNotification({ recipientId: new UniqueEntityId('someone-else') }),
    )

    const result = await sut.execute({ recipientId: 'recipient-1', page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notifications).toEqual([
      expect.objectContaining({ createdAt: new Date(2026, 0, 3) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 1) }),
    ])
  })

  it('should paginate the notifications', async () => {
    for (let i = 0; i < 22; i++) {
      inMemoryNotificationsRepository.items.push(
        makeNotification({ recipientId: new UniqueEntityId('recipient-1') }),
      )
    }

    const result = await sut.execute({ recipientId: 'recipient-1', page: 2 })

    expect(result.value?.notifications).toHaveLength(2)
  })
})
