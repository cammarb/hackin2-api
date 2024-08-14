import type { Request, Response } from 'express'
import {
  addSeverityReward,
  deleteSeverityReward,
  getSeverityRewardById,
  getSeverityRewards,
  updateSeverityReward
} from './severityReward.service'

export const getSeverityRewardsController = async (
  req: Request,
  res: Response
) => {
  try {
    const queryParams = req.query
    if (!queryParams)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const severityRewards = await getSeverityRewards(queryParams)
    return res.status(200).json({ severityRewards: severityRewards })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getSeverityRewardByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id
    if (!id)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const severityReward = getSeverityRewardById(id)

    if (severityReward == null)
      return res.status(404).json({ error: 'Program not found' })

    return res.status(200).json({ severityReward: severityReward })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const addSeverityRewardController = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body
    if (!body)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const severityReward = await addSeverityReward(body)

    return res
      .status(200)
      .json({ message: 'Severity Reward created successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateSeverityRewardController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id
    const { min, max } = req.body
    if (!id || !min || !max)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const severityReward = await updateSeverityReward(id, min, max)

    res.status(200).json({ message: 'Severity Reward updated successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteSeverityRewardController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id
    if (!id)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const severityReward = await deleteSeverityReward(id)

    res.status(204).json({ message: 'Severity Reward deleted.' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
