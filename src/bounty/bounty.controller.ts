import type { Request, Response } from 'express'
import {
  addBounty,
  deleteBounty,
  editBounty,
  getBounties,
  getBountyById
} from './bounty.service'

export const getBountiesController = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query

    const bounties = await getBounties(queryParams)

    if (bounties.length <= 0)
      return res.status(200).json({ message: 'No bounties yet' })
    res.status(200).json({ bounties: bounties })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getBountyByIdController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!id)
      return res.status(400).json({ error: 'Request parameters missing' })

    const bounty = await getBountyById(id)

    if (bounty == null)
      return res.status(404).json({ error: 'Bounty not found' })

    return res.status(200).json({ bounty: bounty })
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

export const editBountyController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const body = req.body
    if (!id || body)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const bounty = await editBounty(id, body)

    if (bounty == null)
      return res.status(404).json({ error: 'Bounty not found' })

    return res.status(200).json({ bounty: bounty })
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

export const addBountyController = async (
  req: Request | any,
  res: Response
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
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteBountyController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!id)
      return res.status(400).json({ error: 'Request parameters missing' })

    const bounty = await deleteBounty(id)

    if (bounty == null)
      return res.status(404).json({ error: 'Bounty not found' })

    return res.status(200).json({ message: 'Bounty deleted successfully' })
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}
