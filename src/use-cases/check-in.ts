import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositores/check-ins-repository'

interface CheckInUseCaseRequest {
  user_id: string
  gym_id: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    user_id,
    gym_id,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id,
      user_id,
    })

    return {
      checkIn,
    }
  }
}
