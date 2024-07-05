import { Request, Response } from "express"
import prisma from "../utils/client"
import { Prisma } from "@prisma/client"

export const addBounty = async (req: Request | any, res: Response) => {
    try {
        const programId = req.params.id
        const { title, description, severityRewardId } = req.body

        if (!title || !programId) {
            return res.status(400).json({ error: 'Title and ProgramID are required' })
        }

        const bounty = await prisma.bounty.create({
            data: {
                title: title,
                description: description,
                severityRewardId: severityRewardId,
                programId: programId,
            },
        })
        res.status(200).json({ message: 'Bounty created successfully' })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError)
            res.status(500).json({
                error: {
                    type: 'Prisma error',
                    message: error.message,
                },
            })
        else res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const getBounties = async (req: Request | any, res: Response) => {
    try {
        const programId = req.params.id

        if (!programId) {
            return res.status(400).json({ error: 'ProgramID is required' })
        }

        const bounties = await prisma.bounty.findMany({
            where: {
                programId: programId,
            },
        })
        res.status(200).json({
            bounties: bounties,
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError)
            res.status(500).json({
                error: {
                    type: 'Prisma error',
                    message: error.message,
                },
            })
        else res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const editBounty = async (req: Request | any, res: Response) => {
    try {
        const bountyId = req.params.id
        const { title } = req.body

        if (!bountyId) {
            return res.status(400).json({ error: 'ProgramID is required' })
        }

        const bounty = await prisma.bounty.update({
            where: {
                id: bountyId,
            },
            data: {
                title: title,
            },
        })
        res.status(200).json({
            bounty: bounty,
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError)
            res.status(500).json({
                error: {
                    type: 'Prisma error',
                    message: error.message,
                },
            })
        else res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const getBounty = async (req: Request | any, res: Response) => {
    try {
        const bountyId = req.params.id
        if (!bountyId) {
            return res.status(400).json({ error: 'BountyID is required' })
        }

        const bounty = await prisma.bounty.findUnique({
            where: {
                id: bountyId,
            },
        })
        res.status(200).json({
            bounty: bounty,
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError)
            res.status(500).json({
                error: {
                    type: 'Prisma error',
                    message: error.message,
                },
            })
        else res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const deleteBounty = async (req: Request | any, res: Response) => {
    try {
        const bountyId = req.params.id

        if (!bountyId) res.status(400).json({ error: 'BountyId is required' })

        const bounty = await prisma.bounty.delete({
            where: {
                id: bountyId,
            },
        })
        res.status(200).json({ message: 'Bounty deleted successfully' })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError)
            res.status(500).json({
                error: {
                    type: 'Prisma error',
                    message: error.message,
                },
            })
        else res.status(500).json({ error: 'Internal Server Error' })
    }
}
