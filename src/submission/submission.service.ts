import prisma from '../utils/client'
import { SubmissionBody, SubmissionQueryParams } from './submission.dto'
import { cloudinary } from '../utils/cloudinary'
import { FileArray, UploadedFile } from 'express-fileupload'

export const getSubmissionById = async (id: string) => {
  const submission = await prisma.submissions.findUnique({
    where: {
      id: id,
    },
  })

  return submission
}

export const getSubmissions = async (queryParams: SubmissionQueryParams) => {
  let userId: string | undefined
  let programId: string | undefined

  if (queryParams.user) userId = queryParams.user
  if (queryParams.program) programId = queryParams.program

  const submissions = await prisma.submissions.findMany({
    where: {
      userId: userId,
      programId: programId,
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

  return submissions
}

export const addSumission = async (
  user: { id: string },
  body: SubmissionBody,
  files: FileArray,
) => {
  const { programId, asset, severity, evidence, impact } = body

  /**
   * 'fileUrls' will store an array of the files urls
   * after they are done being uploaded to Cloudinary
   */
  let fileUrls: string[] = []
  if (files) {
    const findingsArray: FileArray = files
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
      asset: asset,
      programId: programId,
      userId: user.id,
      severityRewardId: severity,
      evidence: evidence,
      impact: impact,
      findings: fileUrls,
    },
  })

  return submission
}
