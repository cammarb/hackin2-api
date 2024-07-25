import { ProgramStatus } from '@prisma/client'

export interface ProgramQueryParams {
  status?: string
  company?: string
}

export interface UpdateProgram {
  name?: string
  description?: string
  programStatus?: ProgramStatus
  location?: string
}
