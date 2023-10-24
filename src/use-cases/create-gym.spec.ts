import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryGymsRepository } from '@/repositores/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

const homeCord = {
  latitude: -23.1792897,
  longitude: -45.8234079,
}

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
      latitude: homeCord.latitude,
      longitude: homeCord.longitude,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
