import type { NextFunction, Request, Response } from 'express'
import {
  addBounty,
  deleteBounty,
  editBounty,
  getBounties,
  getBountyAssignmentById,
  getBountyAssignments,
  getBountyById
} from './bounty.service'
import type { BountyAssignmentsQuery } from './bounty.dto'
import { MissingParameterError, ResourceNotFoundError } from '../error/apiError'
import type { SessionData } from 'express-session'
import { redisClient } from '../utils/redis'

export const getBountiesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.session.user as SessionData['user']
    const queryParams = req.query
    const cacheKey = `bounties${req.url.split('/')[1]}`

    const cachedBounties = await redisClient.get(cacheKey)
    if (cachedBounties)
      return res
        .status(200)
        .json({ bounties: JSON.parse(cachedBounties), cache: true })

    const bounties = await getBounties(queryParams, user)
    if (bounties.length <= 0)
      return res.status(200).json({ message: 'No bounties yet' })

    await redisClient.set(cacheKey, JSON.stringify(bounties), { EX: 500 })

    return res.status(200).json({ bounties: bounties })
  } catch (error) {
    next(error)
  }
}

export const getBountyByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.session.user as SessionData['user']
    const id = req.params.id
    if (!id) throw MissingParameterError

    const bounty = await getBountyById(id, user)

    if (bounty == null) throw new ResourceNotFoundError('bounty')

    return res.status(200).json({ bounty: bounty })
  } catch (error) {
    next(error)
  }
}

export const editBountyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id
    const body = req.body
    if (!id || !body)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const bounty = await editBounty(id, body)

    if (bounty == null)
      return res.status(404).json({ error: 'Bounty not found' })

    return res.status(200).json({ bounty: bounty })
  } catch (error) {
    next(error)
  }
}

export const addBountyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body

    if (!body) {
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })
    }

    const bounty = await addBounty(body)

    res.status(200).json({ message: 'Bounty created successfully' })
  } catch (error) {
    next(error)
  }
}

export const deleteBountyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id
    if (!id)
      return res.status(400).json({ error: 'Request parameters missing' })

    const bounty = await deleteBounty(id)

    if (bounty == null)
      return res.status(404).json({ error: 'Bounty not found' })

    return res.status(200).json({ message: 'Bounty deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const getBountyAssignmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams = req.query as BountyAssignmentsQuery

    const bountyAssingments = await getBountyAssignments(queryParams)
    console.log(bountyAssingments)

    return res.status(200).json({ bountyAssignments: bountyAssingments })
  } catch (error) {
    next(error)
  }
}

export const getBountyAssignmentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bountyId = req.params.bountyId
    const userId = req.query.userId as string

    const bountyAssingment = await getBountyAssignmentById(bountyId, userId)

    return res.status(200).json({ bountyAssignment: bountyAssingment })
  } catch (error) {
    next(error)
  }
}
