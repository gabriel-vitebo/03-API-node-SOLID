import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositores/check-ins-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ValidateCheckInUseCaseRequest {
  checkIn_id: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkIn_id,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkIn_id)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
