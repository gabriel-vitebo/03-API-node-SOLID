import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositores/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositores/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-eror'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const homeCord = {
  latitude: -23.1792897,
  longitude: -45.8234079,
}

const spCord = {
  latitude: -23.2018563,
  longitude: -45.90287,
}

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.create({
      id: 'gym-01',
      title: 'Academia Vitebo',
      description: '',
      phone: '',
      latitude: homeCord.latitude,
      longitude: homeCord.longitude,
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
      userLatitude: homeCord.latitude,
      userLongitude: homeCord.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: homeCord.latitude,
      userLongitude: homeCord.longitude,
    })

    await expect(() =>
      sut.execute({
        gym_id: 'gym-01',
        user_id: 'user-01',
        userLatitude: homeCord.latitude,
        userLongitude: homeCord.longitude,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should  be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: homeCord.latitude,
      userLongitude: homeCord.longitude,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: homeCord.latitude,
      userLongitude: homeCord.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia Vitebo',
      description: '',
      phone: '',
      latitude: new Decimal(spCord.latitude),
      longitude: new Decimal(spCord.longitude),
    })

    await expect(() =>
      sut.execute({
        gym_id: 'gym-02',
        user_id: 'user-01',
        userLatitude: homeCord.latitude,
        userLongitude: homeCord.longitude,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
