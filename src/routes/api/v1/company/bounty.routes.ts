import express, { Router } from 'express'
import {
  getAllBountys,
  getBounty,
  editBounty,
  deleteBounty,
  newBounty,
} from '../../../../controllers/bounty.controller'
import { verifyJWT } from '../../../../middleware/auth.middleware'
import { checkAdmin, checkManager } from '../../../../middleware/roles.middleware'

const bountyRouter: Router = express.Router()

bountyRouter.post('/new', verifyJWT, checkManager, newBounty)
bountyRouter.get('/', verifyJWT, getAllBountys)
bountyRouter.get('/:id', verifyJWT, getBounty)
bountyRouter.put('/:id/edit', verifyJWT, checkManager, editBounty)
bountyRouter.delete('/:id/delete', verifyJWT, checkManager, deleteBounty)

export default bountyRouter
