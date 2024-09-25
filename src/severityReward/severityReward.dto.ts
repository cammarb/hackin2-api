import type { Severity } from '@prisma/client'

export interface SeverityRewardQueryParams {
  program?: string
  severity?: string
}

export interface UpdateSeverityRewardBody {
  min?: number
  max?: number
}

export interface SeverityRewardBody {
  severity: Severity
  min: number
  max: number
  program: string
}
