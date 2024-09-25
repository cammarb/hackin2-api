import type { SubmissionStatus } from '@prisma/client'

export interface SubmissionQueryParams {
  bounty?: string
  user?: string
  program?: string
}

export interface SubmissionBody {
  bountyId: string
  userId: string
  asset: string
  evidence: string
  impact: string
}

export interface UpdateSubmissionBody {
  status: SubmissionStatus
}
