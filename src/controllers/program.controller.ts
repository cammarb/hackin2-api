import { Request, Response } from 'express'
import prisma from '../utils/client'
import { Severity, programStatus } from '@prisma/client'
import { redisClient } from '../utils/redis'

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

export const getProgram = async (req: Request | any, res: Response) => {
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

    if (!programId) res.status(400)

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
    if (!program) res.status(404).json({ error: 'Program not found' })
    res.status(204).json({ message: 'Program updated.' })
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

export const addScope = async (req: Request | any, res: Response) => {
  try {
    const programId = req.params.id
    const { name, description } = req.body
    if (!programId) res.status(400).json({ error: 'Program required' })

    const scope = await prisma.scope.create({
      data: {
        programId: programId,
        name: name,
        description: description,
      },
    })
    res.status(200).json({ message: 'Scope created successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateScope = async (req: Request | any, res: Response) => {
  try {
    const scopeId = req.params.id
    const { name, description } = req.body
    if (!scopeId) res.status(400).json({ error: 'Scope required' })

    const scope = await prisma.scope.update({
      where: {
        id: scopeId,
      },
      data: {
        name: name,
        description: description,
      },
    })
    res.status(200).json({ message: 'Scope updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getProgramScopes = async (req: Request | any, res: Response) => {
  try {
    const programId = req.params.id
    if (!programId) res.status(400).json({ error: 'Program required' })

    const scopes = await prisma.scope.findMany({
      where: {
        programId: programId,
      },
    })
    res.status(200).json({ scopes: scopes })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteScope = async (req: Request | any, res: Response) => {
  try {
    const scopeId = req.params.id
    if (!scopeId) res.status(400)
    const scope = await prisma.scope.delete({
      where: {
        id: scopeId,
      },
    })
    res.status(204).json({ message: 'Scope deleted.' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const addSeverityReward = async (req: Request | any, res: Response) => {
  try {
    const programId = req.params.id
    const { severity, min, max } = req.body
    if (!programId)
      res.status(400).json({ error: 'Program and other fields required' })

    const severityReward = await prisma.severityReward.create({
      data: {
        severity: severity,
        min: min,
        max: max,
        programId: programId,
      },
    })
    res.status(200).json({ message: 'Severity Reward created successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateSeverityReward = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const severityId = req.params.id
    const { min, max } = req.body
    if (!severityId) res.status(400).json({ error: 'Severity Reward required' })

    const scope = await prisma.severityReward.update({
      where: {
        id: severityId,
      },
      data: {
        min: min,
        max: max,
      },
    })
    res.status(200).json({ message: 'Severity Reward updated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getProgramSeverityRewards = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const programId = req.params.id
    if (!programId) res.status(400).json({ error: 'Program required' })

    const severityRewards = await prisma.severityReward.findMany({
      where: {
        programId: programId,
      },
    })
    res.status(200).json({ severityRewards: severityRewards })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteSeverityReward = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const severityId = req.params.id
    if (!severityId) res.status(400)
    const severityReward = await prisma.scope.delete({
      where: {
        id: severityId,
      },
    })
    res.status(204).json({ message: 'Severity Reward deleted.' })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
