import type { Request, Response } from 'express'
import { deleteUser, editUser, getUserById, getUsers } from './user.service'
import type { UserQueryParams } from './user.dto'

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query as UserQueryParams

    const users = await getUsers(queryParams)

    if (users.length == 0)
      return res.status(404).json({ error: 'Programs not found' })

    res.status(200).json({
      users
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    if (!id)
      return res.status(400).json({ error: 'Request parameters missing' })

    const user = await getUserById(id)

    if (!user) return res.status(404).json({ error: 'User not found' })

    res.status(200).json({ user: user })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const editUserController = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    const body = req.body
    if (!id || !body)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const user = await editUser(id, body)
    res.status(200).json({ user: user })
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    if (!id)
      return res.status(400).json({ error: 'Request parameters missing' })

    const user = await deleteUser(id)
    if (!user) return res.sendStatus(404).json({ error: 'User not found' })

    res.status(200).json({ message: `User deleted` })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
