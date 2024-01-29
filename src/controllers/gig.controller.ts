import { Request, Response } from 'express'
import prisma from '../config/db'
import { Role, Gig } from '@prisma/client'
import { checkAdmin } from '../middleware/roles.middleware'

export const newGig = async (req: Request, res: Response) => {
  const {
    title,
    description,
    gigTypeId,
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
    !gigTypeId ||
    !requirements ||
    !paymentDetails ||
    !startDate ||
    !endDate ||
    !postedById
  )
    return res.status(400).json({ messaege: 'All the fields are required' })

  const gig: Gig | null = await prisma.gig.findUnique({
    where: {
      title: title,
    },
  })
  if (gig !== null) return res.sendStatus(409)
  try {
    const gig: Gig = await prisma.gig.create({
      data: {
        title: title,
        description: description,
        gigTypeId: gigTypeId,
        requirements: { set: requirements },
        paymentDetails: paymentDetails,
        startDate: startDate,
        endDate: endDate,
        postedById: postedById,
      },
    })
    res.status(201).json({ success: 'Gig created successfully' })
  } catch (err: Error | any) {
    res.status(500).json({ message: err?.message })
  }
}

export const getAllGigs = async (req: Request, res: Response) => {
  try {
    const gigs: Gig[] = await prisma.gig.findMany()
    res.status(200).json({
      gigs,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getGig = async (req: Request, res: Response) => {
  try {
    const gigId: string = req.params.gigId

    const gig: Gig | null = await prisma.gig.findUnique({
      where: {
        id: gigId,
      },
    })
    if (!gig) res.status(404).json({ error: 'Gig not found' })
    res.status(200).json({
      id: gig?.id,
      title: gig?.title,
      description: gig?.description,
      gigTypeId: gig?.gigTypeId,
      requirements: gig?.requirements,
      paymentDetails: gig?.paymentDetails,
      startDate: gig?.startDate,
      endDate: gig?.endDate,
      postedById: gig?.postedById,
      menteeAssignedId: gig?.menteeAssignedId,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editGig = async (req: Request, res: Response) => {
  try {
    const gigId = req.params.id
    const {
      title,
      description,
      gigTypeId,
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
      !gigTypeId ||
      !requirements ||
      !paymentDetails ||
      !startDate ||
      !endDate ||
      !postedById
    )
      return res.status(400).json({ messaege: 'All the fields are required' })
    else {
      const gig: Gig | null = await prisma.gig.update({
        where: {
          id: gigId,
        },
        data: {
          title: title,
          description: description,
          gigTypeId: gigTypeId,
          requirements: requirements,
          paymentDetails: paymentDetails,
          startDate: startDate,
          endDate: endDate,
          postedById: postedById,
          menteeAssignedId: menteeAssignedId,
        },
      })
      res.status(200).json({
        id: gig?.id,
        title: gig?.title,
        description: gig?.description,
        gigTypeId: gig?.gigTypeId,
        requirements: gig?.requirements,
        paymentDetails: gig?.paymentDetails,
        startDate: gig?.startDate,
        endDate: gig?.endDate,
        postedById: gig?.postedById,
        menteeAssignedId: gig?.menteeAssignedId,
      })
    }
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const deleteGig = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    const gig: Gig | null = await prisma.gig.delete({
      where: {
        id: id,
      },
    })
    if (!gig) res.sendStatus(404).json({ error: 'Gig not found' })
    res.status(200).json({ message: `Gig with id: ${id} deleted successfully` })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
