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
  const submission = await prisma.submissions.findUnique({
    where: {
      id: id
    }
  })

  return submission
}

export const getSubmissions = async (queryParams: SubmissionQueryParams) => {
  let userId: string | undefined
  let bountyId: string | undefined

  if (queryParams.user) userId = queryParams.user
  if (queryParams.bounty) bountyId = queryParams.bounty

  const submissions = await prisma.submissions.findMany({
    where: {
      BountyAssignment: {
        bountyId: bountyId,
        userId: userId
      }
    }
  })

  return submissions
}

export const addSumission = async (body: SubmissionBody, files?: FileArray) => {
  /**
   * Users can submit only once to a Program.
   * We need to check this first before proceeding.
   */
  const { bountyAssignmentId, asset, evidence, impact } = body

  const userProgramSubmission = await prisma.submissions.findUnique({
    where: {
      bountyAssignmentId: bountyAssignmentId
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

  const submission = await prisma.submissions.create({
    data: {
      asset: asset,
      bountyAssignmentId: bountyAssignmentId,
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

  const submissions = await prisma.submissions.update({
    where: {
      id: id
    },
    data: {
      status: status as SubmissionStatus
    }
  })

  return submissions
}
