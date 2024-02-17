import { Request, Response } from 'express'
import prisma from '../config/db'
import { Role, Bounty } from '@prisma/client'
import { checkAdmin } from '../middleware/roles.middleware'

export const newBounty = async (req: Request, res: Response) => {
  const {
    title,
    description,
    bountyTypeId,
    requirements,
    paymentDetails,
    startDate,
    endDate,
    postedById,
    menteeAssignedId,
  } = req.body
  if (
    !title ||
    !description ||
    !bountyTypeId ||
    !requirements ||
    !paymentDetails ||
    !startDate ||
    !endDate ||
    !postedById
  )
    return res.status(400).json({ messaege: 'All the fields are required' })

  const bounty: Bounty | null = await prisma.bounty.findUnique({
    where: {
      title: title,
    },
  })
  if (bounty !== null) return res.sendStatus(409)
  try {
    const bounty: Bounty = await prisma.bounty.create({
      data: {
        title: title,
        description: description,
        bountyTypeId: bountyTypeId,
        requirements: { set: requirements },
        paymentDetails: paymentDetails,
        startDate: startDate,
        endDate: endDate,
        postedById: postedById,
      },
    })
    res.status(201).json({ success: 'Bounty created successfully' })
  } catch (err: Error | any) {
    res.status(500).json({ message: err?.message })
  }
}

export const getAllBountys = async (req: Request, res: Response) => {
  try {
    const bountys: Bounty[] = await prisma.bounty.findMany()
    res.status(200).json({
      bountys,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getBounty = async (req: Request, res: Response) => {
  try {
    const bountyId: string = req.params.bountyId

    const bounty: Bounty | null = await prisma.bounty.findUnique({
      where: {
        id: bountyId,
      },
    })
    if (!bounty) res.status(404).json({ error: 'Bounty not found' })
    res.status(200).json({
      id: bounty?.id,
      title: bounty?.title,
      description: bounty?.description,
      bountyTypeId: bounty?.bountyTypeId,
      requirements: bounty?.requirements,
      paymentDetails: bounty?.paymentDetails,
      startDate: bounty?.startDate,
      endDate: bounty?.endDate,
      postedById: bounty?.postedById,
      menteeAssignedId: bounty?.menteeAssignedId,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editBounty = async (req: Request, res: Response) => {
  try {
    const bountyId = req.params.id
    const {
      title,
      description,
      bountyTypeId,
      requirements,
      paymentDetails,
      startDate,
      endDate,
      postedById,
      menteeAssignedId,
    } = req.body

    if (
      !title ||
      !description ||
      !bountyTypeId ||
      !requirements ||
      !paymentDetails ||
      !startDate ||
      !endDate ||
      !postedById
    )
      return res.status(400).json({ messaege: 'All the fields are required' })
    else {
      const bounty: Bounty | null = await prisma.bounty.update({
        where: {
          id: bountyId,
        },
        data: {
          title: title,
          description: description,
          bountyTypeId: bountyTypeId,
          requirements: requirements,
          paymentDetails: paymentDetails,
          startDate: startDate,
          endDate: endDate,
          postedById: postedById,
          menteeAssignedId: menteeAssignedId,
        },
      })
      res.status(200).json({
        id: bounty?.id,
        title: bounty?.title,
        description: bounty?.description,
        bountyTypeId: bounty?.bountyTypeId,
        requirements: bounty?.requirements,
        paymentDetails: bounty?.paymentDetails,
        startDate: bounty?.startDate,
        endDate: bounty?.endDate,
        postedById: bounty?.postedById,
        menteeAssignedId: bounty?.menteeAssignedId,
      })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const deleteBounty = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    const bounty: Bounty | null = await prisma.bounty.delete({
      where: {
        id: id,
      },
    })
    if (!bounty) res.sendStatus(404).json({ error: 'Bounty not found' })
    res.status(200).json({ message: `Bounty with id: ${id} deleted successfully` })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
