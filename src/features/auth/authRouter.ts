import { Router } from 'express'
import { loginController } from './controllers/loginController'
import { getUserInfoController } from './controllers/getUserInfo'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { loginOrEmailValidation, passwordValidation } from '../../common/validation/express-validation'
import { inputValidationMiddleware } from '../../middlewares/inputValidation.middleware'

export const authRouter = Router({})

authRouter.post('/login',
	loginOrEmailValidation,
	passwordValidation,
	inputValidationMiddleware,
	loginController)
authRouter.get('/me',
	authMiddleware,
	getUserInfoController)
