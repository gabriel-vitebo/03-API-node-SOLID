import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositores/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'
import { coordinates } from '@/utils/coordinates'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Vitebo Gym',
      description: null,
      phone: null,
      latitude: coordinates.userCoord.latitude,
      longitude: coordinates.userCoord.latitude,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
