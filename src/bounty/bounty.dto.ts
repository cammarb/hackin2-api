import type { BountyStatus } from '@prisma/client'

export interface BountyQueryParams {
  severity?: string
  program?: string
  status?: string
}

export interface UpdateBountyBody {
  title?: string
  description?: string
  status?: BountyStatus
  severityRewardId?: string
}

export interface AddBountyBody {
  title: string
  description: string
  severityRewardId: string
  programId: string
  notes: string
}

export interface BountyAssignmentsQuery {
  bounty?: string
  user?: string
}
