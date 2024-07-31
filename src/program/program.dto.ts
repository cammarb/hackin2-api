import { ProgramStatus } from '@prisma/client'

export interface ProgramQueryParams {
  status?: string
  company?: string
}

export interface UpdateProgramBody {
  name?: string
  description?: string
  programStatus?: ProgramStatus
  location?: string
}

export interface NewProgramBody {
  name: string
  description: string
  location: string
}

export interface NewProgramQuery {
  company: string
}
