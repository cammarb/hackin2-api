import express, { Router } from 'express'
import { verifyJWT } from '../../../../middleware/auth.middleware'
import { getAllUsers } from '../../../../controllers/user.controller'
import { editCompany, getCompany } from '../../../../controllers/company.controller'

const companyRouter: Router = express.Router()

companyRouter.get('/dashboard')

// User Management
companyRouter.get('/users', verifyJWT, getAllUsers)
companyRouter.put('/users/:id', verifyJWT)
companyRouter.delete('/users/:id', verifyJWT)

// Programs
companyRouter.get('/programs', verifyJWT)
companyRouter.get('/programs/:id', verifyJWT)

// Settings
companyRouter.get('/settings', verifyJWT, getCompany)
companyRouter.put('/settings/edit', verifyJWT, editCompany)

export default companyRouter
