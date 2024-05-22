import { Request, Response } from 'express'
import prisma from '../utils/client'

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
      },
    })
    res.status(200).json({ message: 'Program created successfully' })
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
    const { name, description, location } = req.body

    if (!programId) res.status(400)

    const program = await prisma.program.update({
      where: {
        id: programId,
      },
      data: {
        name: name,
        description: description,
        location: location,
      },
    })
    if (!program) res.status(404).json({ error: 'Program not found' })
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