import { Router } from 'express'
import {
  addSeverityRewardController,
  deleteSeverityRewardController,
  getSeverityRewardByIdController,
  getSeverityRewardsController,
  updateSeverityRewardController
} from './severityReward.controller'

export const severityRewardRouter: Router = Router()

severityRewardRouter.get('/', getSeverityRewardsController)
severityRewardRouter.get('/:id', getSeverityRewardByIdController)
severityRewardRouter.post('/new', addSeverityRewardController)
severityRewardRouter.put('/:id/edit', updateSeverityRewardController)
severityRewardRouter.delete('/:id/delete', deleteSeverityRewardController)
