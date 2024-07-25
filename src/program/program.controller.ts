import { Request, Response } from 'express'
import prisma from '../utils/client'
import { Severity } from '@prisma/client'
import { redisClient } from '../utils/redis'
import { editProgram, getProgramById, getPrograms } from './program.service'
import { ProgramQueryParams } from './program.dto'

export const addProgram = async (req: Request | any, res: Response) => {
  try {
    const companyId = req.companyId
    const userId = req.userId as string
    const { name, description, location } = req.body

    const program = await prisma.program.create({
      data: {
        name: name,
        companyId: companyId,
        description: description,
        location: location,
        SeverityReward: {
          create: [
            {
              severity: Severity.LOW,
              min: 50,
              max: 200,
            },
            {
              severity: Severity.MEDIUM,
              min: 250,
              max: 1000,
            },
            {
              severity: Severity.HIGH,
              min: 1500,
              max: 4000,
            },
            {
              severity: Severity.CRITICAL,
              min: 5000,
              max: 10000,
            },
          ],
        },
      },
    })
    res.status(200).json({ message: 'Program created successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getAllPrograms = async (req: Request | any, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      where: {
        programStatus: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        description: true,
        programStatus: true,
        location: true,
        Company: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!programs) res.status(404).json({ message: 'No Programs found.' })
    res.status(200).json({
      programs: programs,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getActiveProgram = async (req: Request | any, res: Response) => {
  try {
    const programId = req.params.id

    const program = await prisma.program.findUnique({
      where: {
        id: programId,
      },
      include: {
        Company: {
          select: {
            name: true,
            website: true,
          },
        },
        SeverityReward: {
          select: {
            min: true,
            max: true,
            severity: true,
          },
        },
      },
    })
    if (!program) res.status(404).json({ message: 'Program not found' })
    res.status(200).json({
      program: program,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const programId = req.params.id
    const { name, description, location, programStatus } = req.body

    if (!programId) return res.status(400)

    const program = await prisma.program.update({
      where: {
        id: programId,
      },
      data: {
        name: name,
        description: description,
        location: location,
        programStatus: programStatus,
      },
    })

    const redisKey = 'hackin2-api:programs'
    const cachedPrograms = await redisClient.get(redisKey)
    if (cachedPrograms != null) await redisClient.del(redisKey)
    if (!program) return res.status(404).json({ error: 'Program not found' })

    return res.status(200).json({ message: 'Program updated.' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const programId = req.params.id
    if (!programId) res.status(400)
    const program = await prisma.program.delete({
      where: {
        id: programId,
      },
    })
    if (!program) res.status(404).json({ error: 'Program not found.' })
    res.status(204).json({ message: 'Program deleted.' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getProgramsController = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query as ProgramQueryParams

    const programs = await getPrograms(queryParams)

    if (programs.length == 0)
      return res.status(404).json({ error: 'Programs not found' })

    res.status(200).json({ programs: programs })
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'Invalid query parameter' ||
        error.message === 'Invalid status value'
      ) {
        return res.status(400).json({ error: error.message })
      }
    }
    return res.status(500).json({ error: error })
  }
}

export const getProgramByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!id)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const program = await getProgramById(id)

    if (program == null)
      return res.status(404).json({ error: 'Program not found' })

    return res.status(200).json({ program: program })
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

export const editProgramController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const body = req.body
    if (!id || !body)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const program = await editProgram(id, body)

    if (program == null)
      return res.status(404).json({ error: 'Program not found' })

    return res.status(200).json({ program: program })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
