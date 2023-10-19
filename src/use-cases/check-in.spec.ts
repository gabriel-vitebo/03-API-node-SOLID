import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositores/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositores/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Academia Vitebo',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: -23.299966,
      userLongitude: -45.9866112,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: -23.299966,
      userLongitude: -45.9866112,
    })

    await expect(() =>
      sut.execute({
        gym_id: 'gym-01',
        user_id: 'user-01',
        userLatitude: -23.299966,
        userLongitude: -45.9866112,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should  be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: -23.299966,
      userLongitude: -45.9866112,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: -23.299966,
      userLongitude: -45.9866112,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})

// -23.299966,-45.9866112
