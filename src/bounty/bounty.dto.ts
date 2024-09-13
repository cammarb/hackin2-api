export interface BountyQueryParams {
  severity?: string
  program?: string
}

export interface UpdateBountyBody {
  title?: string
  description?: string
  severityRewardId?: string
}

export interface AddBountyBody {
  title: string
  description: string
  severityRewardId: string
  programId: string
}

export interface BountyAssignmentsQuery {
  bounty?: string
  user?: string
}
