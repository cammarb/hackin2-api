import type { SubmissionStatus } from '@prisma/client'

export interface SubmissionQueryParams {
  program?: string
  user?: string
}

export interface SubmissionBody {
  programId: string
  asset: string
  severity: string
  evidence: string
  impact: string
}

export interface UpdateSubmissionBody {
  status: SubmissionStatus
}
