import { NextFunction, Request, Response } from 'express'
import {
  addProgram,
  deleteProgram,
  editProgram,
  getProgramById,
  getPrograms,
} from './program.service'
import { ProgramQueryParams } from './program.dto'
import {
  InvalidParameterError,
  MissingBodyParameterError,
  MissingParameterError,
  NotFoundError,
  ResourceNotFoundError,
} from '../error/apiError'

export const addProgramController = async (req: Request, res: Response) => {
  try {
    const companyId = req.query.company as string
    const body = req.body

    const program = await addProgram(companyId, body)

    return res.status(200).json({ message: 'Program created successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getProgramsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryParams = req.query as ProgramQueryParams

    const programs = await getPrograms(queryParams)

    if (programs.length == 0) throw new ResourceNotFoundError()

    res.status(200).json({ programs: programs })
  } catch (error) {
    next(error)
  }
}

export const getProgramByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id

    const program = await getProgramById(id)

    if (program == null) throw new ResourceNotFoundError(id)

    return res.status(200).json({ program: program })
  } catch (error) {
    next(error)
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

export const deleteProgramController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    const program = await deleteProgram(id)
    if (!program) throw new ResourceNotFoundError(id)

    return res.status(204).json({ message: 'Program deleted.' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
