import { Router } from 'express'
import { loginController } from './controllers/loginController'
import { getUserInfoController } from './controllers/getUserInfo'
import { authMiddleware } from '../../middlewares/auth.middleware'
import {
	codeValidation,
	emailValidationForRegistration, emailValidationForResend,
	loginOrEmailValidation,
	loginValidation,
	passwordValidation
} from '../../common/validation/express-validation'
import { inputValidationMiddleware } from '../../middlewares/inputValidation.middleware'
import { registrationController } from './controllers/registration.controller'
import { registrationConfirmationController } from './controllers/registrationConfirmation.controller'
import { emailResendingController } from './controllers/emailResending.controller'
import {refreshTokenController} from "./controllers/refreshToken.controller";
import {logoutController} from "./controllers/logout.controller";

export const authRouter = Router({})

authRouter.post('/login',
	loginOrEmailValidation,
	passwordValidation,
	inputValidationMiddleware,
	loginController
)

authRouter.post('/logout',
	logoutController
)

authRouter.post('/refresh-token',
	refreshTokenController
)

authRouter.post('/registration',
	loginValidation,
	passwordValidation,
	emailValidationForRegistration,
	inputValidationMiddleware,
	registrationController
)
authRouter.post('/registration-confirmation',
	codeValidation,
	inputValidationMiddleware,
	registrationConfirmationController
)
authRouter.post('/registration-email-resending',
	emailValidationForResend,
	inputValidationMiddleware,
	emailResendingController
)

authRouter.get('/me',
	authMiddleware,
	getUserInfoController)
