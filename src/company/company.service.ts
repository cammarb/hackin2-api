import { Request, Response } from 'express'
import { Company } from '@prisma/client'
import prisma from '../utils/client'
import { redisClient } from '../utils/redis'

export const getCompany = async (req: Request | any, res: Response) => {
  try {
    const companyId = req.companyId
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        name: true,
      },
    })
    res.status(200).json({
      message: `Welcome to Company ${company?.name}.`,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editCompany = async (req: Request | any, res: Response) => {
  try {
    const companyId = req.companyId
    const { name, website } = req.body

    const company: Company | null = await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        name: name,
        website: website,
      },
    })

    res.status(200).json({
      company,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getCompanyPrograms = async (req: Request | any, res: Response) => {
  try {
    const companyId = req.companyId as string
    const redisKey = `hackin2-api:programs:${companyId}`

    const programs = await redisClient.get(redisKey)
    if (programs != null) {
      return res.json({ programs: JSON.parse(programs) })
    } else {
      const programs = await prisma.program.findMany({
        where: {
          companyId: companyId,
        },
      })
      await redisClient.setEx(redisKey, 300, JSON.stringify(programs))
      return res.status(200).json({
        programs,
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
