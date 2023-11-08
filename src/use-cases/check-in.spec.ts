import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositores/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositores/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'
import { coordinates } from '@/utils/coordinates'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia Vitebo',
      description: '',
      phone: '',
      latitude: coordinates.userCoord.latitude,
      longitude: coordinates.userCoord.longitude,
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
      userLatitude: coordinates.userCoord.latitude,
      userLongitude: coordinates.userCoord.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: coordinates.userCoord.latitude,
      userLongitude: coordinates.userCoord.longitude,
    })

    await expect(() =>
      sut.execute({
        gym_id: 'gym-01',
        user_id: 'user-01',
        userLatitude: coordinates.userCoord.latitude,
        userLongitude: coordinates.userCoord.longitude,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should  be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: coordinates.userCoord.latitude,
      userLongitude: coordinates.userCoord.longitude,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gym_id: 'gym-01',
      user_id: 'user-01',
      userLatitude: coordinates.userCoord.latitude,
      userLongitude: coordinates.userCoord.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia Vitebo',
      description: '',
      phone: '',
      latitude: new Decimal(coordinates.gymCoord.latitude),
      longitude: new Decimal(coordinates.gymCoord.longitude),
    })

    await expect(() =>
      sut.execute({
        gym_id: 'gym-02',
        user_id: 'user-01',
        userLatitude: coordinates.userCoord.latitude,
        userLongitude: coordinates.userCoord.longitude,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
