import type { NextFunction, Request, Response } from 'express'
import {
  addCompanyMember,
  deleteCompanyMember,
  editCompanyMember,
  getCompanyMemberById,
  getCompanyMembers
} from './companyMember.service'
import type { SessionData } from 'express-session'

export const getCompanyMembersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = req.session.user as SessionData['user']

    const companyMembers = await getCompanyMembers(session)

    if (companyMembers == null)
      return res.status(400).json({
        error: 'Resource not found'
      })

    res.status(200).json({
      companyMembers: companyMembers
    })
  } catch (error) {
    next(error)
  }
}

export const addCompanyMembersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = req.session.user as SessionData['user']
    const email = req.body.email

    if (!email || !session)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const companyMember = await addCompanyMember(email, session)

    res.status(200).json({ message: `Invitation sent` })
  } catch (error) {
    next(error)
  }
}

export const getCompanyMemberByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id

    if (!id)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const companyMember = await getCompanyMemberById(id)

    if (!companyMember)
      return res.status(404).json({ error: 'Resource not found' })

    res.status(200).json({
      member: companyMember
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editCompanyMemberController = async (
  req: Request | any,
  res: Response
) => {
  try {
    const id = req.params.id
    const { role } = req.body

    if (!id || role)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const companyMember = await editCompanyMember(id, role)

    if (!companyMember)
      return res.status(404).json({ error: 'Resource not found' })

    res.status(200).json({
      member: companyMember
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteCompanyMemberController = async (
  req: Request | any,
  res: Response
) => {
  try {
    const id = req.params.id

    if (!id)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const member = await deleteCompanyMember(id)

    res.status(200).json({
      message: `Member was successfully removed.`
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
