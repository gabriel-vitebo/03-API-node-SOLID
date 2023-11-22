import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchUserCheckInHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-usecase'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInHistoryUseCase()

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    user_id: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
