import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositores/check-ins-repository'

interface FetchUserCheckInsHistoryUseCaseRequest {
  user_id: string
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    user_id,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(user_id)

    return {
      checkIns,
    }
  }
}
