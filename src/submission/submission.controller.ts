import { query, type Request, type Response } from 'express'
import {
  addSumission,
  getSubmissionById,
  getSubmissions
} from './submission.service'

export const addSumissionController = async (
  req: Request | any,
  res: Response
) => {
  try {
    const user = req.session.user
    const body = req.body
    const files = req.files

    if (!body) return res.status(400).json({ error: 'All fields are required' })

    const submission = await addSumission(user, body, files)

    return res.status(200).json({ message: 'Submission Report sent' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getSubmissionsController = async (
  req: Request | any,
  res: Response
) => {
  try {
    const queryParams = req.query

    const submissions = await getSubmissions(queryParams)

    if (submissions == null)
      return res.status(400).json({ error: 'Resource not found' })

    return res.status(200).json({ submissions: submissions })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getSubmissionByIdController = async (
  req: Request | any,
  res: Response
) => {
  try {
    const id = req.params.id

    const submission = await getSubmissionById(id)

    if (submission == null)
      return res.status(400).json({ error: 'Resource not found' })

    return res.status(200).json({ submission: submission })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
