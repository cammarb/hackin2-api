import prisma from '../utils/client'
import type {
  SubmissionBody,
  SubmissionQueryParams,
  UpdateSubmissionBody
} from './submission.dto'
import { cloudinary } from '../utils/cloudinary'
import type { FileArray, UploadedFile } from 'express-fileupload'
import { ConflictError } from '../error/apiError'
import type { SubmissionStatus } from '@prisma/client'

export const getSubmissionById = async (id: string) => {
  const submission = await prisma.submission.findUnique({
    where: {
      id: id
    }
  })

  return submission
}

export const getSubmissions = async (queryParams: SubmissionQueryParams) => {
  const { user, bounty, program } = queryParams

  let filterBy = {}

  if (user) {
    filterBy = { userId: user }
  } else if (bounty) {
    filterBy = { bountyId: bounty }
  } else if (program) {
    filterBy = { Bounty: { programId: program } }
  }

  const submissions = await prisma.submission.findMany({
    where: {
      BountyAssignment: filterBy
    },
    include: {}
  })

  return submissions
}

export const addSumission = async (body: SubmissionBody, files?: FileArray) => {
  /**
   * Users can submit only once to a Program.
   * We need to check this first before proceeding.
   */
  const { bountyId, userId, asset, evidence, impact } = body

  const userProgramSubmission = await prisma.submission.findUnique({
    where: {
      bountyId_userId: {
        bountyId: bountyId,
        userId: userId
      }
    }
  })
  if (userProgramSubmission)
    throw new ConflictError('User already submitted to this program.')

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
        resource_type: 'auto'
      })
    })

    const uploadResults = await Promise.all(uploadPromises)
    fileUrls = uploadResults.map((result) => result.secure_url)
  }

  const submission = await prisma.submission.create({
    data: {
      bountyId: bountyId,
      userId: userId,
      asset: asset,
      evidence: evidence,
      impact: impact,
      findings: fileUrls
    }
  })

  return submission
}

export const updateSubmission = async (
  id: string,
  body: UpdateSubmissionBody
) => {
  const { status } = body

  const submissions = await prisma.submission.update({
    where: {
      id: id
    },
    data: {
      status: status as SubmissionStatus
    }
  })

  return submissions
}
