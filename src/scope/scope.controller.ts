import type { Request, Response } from 'express'
import { addScope, deleteScope, getScopes } from './scope.service'
import type { ScopeQueryParams } from './scope.dto'

export const addScopeController = async (req: Request | any, res: Response) => {
  try {
    const queryParams = req.queryParams
    const body = req.body

    if (!queryParams || body)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const scope = await addScope(queryParams, body)

    res.status(200).json({ message: 'Scope created successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const updateScopeController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const body = req.body
    if (!id || !body)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    res.status(200).json({ message: 'Scope updated successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getScopesController = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query as unknown as ScopeQueryParams

    if (!queryParams)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const scopes = await getScopes(queryParams)

    if (!scopes) return res.status(404).json({ error: 'Resource not found' })

    res.status(200).json({ scopes: scopes })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const deleteScopeController = async (
  req: Request | any,
  res: Response
) => {
  try {
    const id = req.params.id
    if (!id)
      return res
        .status(400)
        .json({ error: 'Request parameters or body missing' })

    const scope = await deleteScope(id)

    res.status(204).json({ message: 'Scope deleted.' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
