import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositores/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get user metrics useCase', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym01',
      user_id: 'user01',
    })

    await checkInsRepository.create({
      gym_id: 'gym02',
      user_id: 'user01',
    })

    const { checkInsCount } = await sut.execute({
      user_id: 'user01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
