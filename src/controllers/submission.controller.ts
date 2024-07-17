import { Request, Response } from 'express'
import prisma from '../utils/client'
import { cloudinary } from '../utils/cloudinary'
import { FileArray, UploadedFile } from 'express-fileupload'

export const submitReport = async (req: Request | any, res: Response) => {
  try {
    const programId = req.params.id
    const user = req.session.user
    const { asset, severity, evidence, impact } = req.body

    if (!programId)
      return res.status(400).json({ error: 'All fields are required' })

    /**
     * 'fileUrls' will store an array of the files urls uploaded to Cloudinary
     */
    let fileUrls: string[] = []
    if (req.files) {
      const findingsArray: FileArray = req.files
      const findings = Object.values(findingsArray).flat()

      const uploadPromises = findings.map((file: UploadedFile) => {
        return cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'uploads',
          resource_type: 'auto',
        })
      })

      const uploadResults = await Promise.all(uploadPromises)
      fileUrls = uploadResults.map((result) => result.secure_url)
    }

    const submission = await prisma.submissions.create({
      data: {
        asset,
        programId: programId,
        userId: user.id,
        severityRewardId: severity,
        evidence,
        impact,
        findings: fileUrls,
      },
    })
    return res.status(200).json({ message: 'Submission Report sent' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getAllSubmissions = async (req: Request | any, res: Response) => {
  try {
    const username = req.session.username
    const submissions = await prisma.submissions.findMany({
      where: {
        User: {
          username: username,
        },
      },
      include: {
        Program: {
          select: {
            name: true,
          },
        },
        Severity: {
          select: {
            severity: true,
          },
        },
      },
    })

    return res.status(200).json({ submissions: submissions })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
