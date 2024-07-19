import { Router } from 'express'
import prisma from '../utils/client'
import { Program, ProgramStatus } from '@prisma/client'

export const programRoutes: Router = Router()

programRoutes.get('/', async (req, res) => {
  try {
    let programs: Program[]

    const queryParams = req.query

    if (!queryParams) programs = await prisma.program.findMany()

    const allowedParams = ['status', 'company']
    for (const param in queryParams) {
      if (!allowedParams.includes(param)) {
        return res.status(400).json({ error: `Invalid query parameter` })
      }
    }

    let programStatus
    let companyId

    if (queryParams.status) {
      const status = queryParams.status
        .toString()
        .toUpperCase() as ProgramStatus
      if (!Object.values(ProgramStatus).includes(status)) {
        return res.status(400).json({ error: `Invalid status value` })
      }
      programStatus = status as ProgramStatus
    }

    if (queryParams.company) {
      companyId = queryParams.company as string
    }

    programs = await prisma.program.findMany({
      where: {
        companyId: companyId,
        programStatus: programStatus,
      },
    })

    if (programs.length == 0)
      return res.status(404).json({ error: 'Programs not found' })

    res.status(200).json({ programs: programs })
  } catch (error) {
    return res.status(500).json({ error: error })
  }
})
