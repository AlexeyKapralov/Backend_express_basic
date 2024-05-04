import { Router } from 'express'
import { loginController } from './controllers/loginController'
import { getUserInfoController } from './controllers/getUserInfo'
import { authMiddleware } from '../../middlewares/auth.middleware'

export const authRouter = Router({})

authRouter.post('/login', loginController)
authRouter.get('/me',
	authMiddleware,
	getUserInfoController)
