import {Router} from 'express'
import {loginController} from './controllers/loginController'
import {getUserInfoController} from './controllers/getUserInfo'
import {authMiddleware} from '../../middlewares/auth.middleware'
import {
    codeValidation, emailValidationForRecovery,
    emailValidationForRegistration, emailValidationForResend,
    loginOrEmailValidation,
    loginValidation, newPasswordValidation,
    passwordValidation, recoveryCodeValidation
} from '../../common/validation/express-validation'
import {inputValidationMiddleware} from '../../middlewares/inputValidation.middleware'
import {registrationController} from './controllers/registration.controller'
import {registrationConfirmationController} from './controllers/registrationConfirmation.controller'
import {emailResendingController} from './controllers/emailResending.controller'
import {refreshTokenController} from "./controllers/refreshToken.controller";
import {logoutController} from "./controllers/logout.controller";
import {rateLimitMiddleware} from "../../middlewares/rateLimit.middleware";
import {checkCookieMiddleware} from "../../middlewares/checkCookie.middleware";
import {passwordRecoveryController} from "./controllers/passwordRecovery.controller";
import {newPasswordController} from "./controllers/newPassword.controller";

export const authRouter = Router({})

authRouter.post('/login',
    rateLimitMiddleware,
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware,
    loginController
)

authRouter.post(
    '/password-recovery',
    rateLimitMiddleware,
    emailValidationForRecovery,
    inputValidationMiddleware,
    passwordRecoveryController
)

authRouter.post('/new-password',
    rateLimitMiddleware,
    newPasswordValidation,
    recoveryCodeValidation,
    inputValidationMiddleware,
    newPasswordController
)

authRouter.post('/refresh-token',
    rateLimitMiddleware,
    checkCookieMiddleware,
    refreshTokenController
)

authRouter.post('/registration',
    rateLimitMiddleware,
    loginValidation,
    passwordValidation,
    emailValidationForRegistration,
    inputValidationMiddleware,
    registrationController
)

authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    codeValidation,
    inputValidationMiddleware,
    registrationConfirmationController
)
authRouter.post('/registration-email-resending',
    rateLimitMiddleware,
    emailValidationForResend,
    inputValidationMiddleware,
    emailResendingController
)
authRouter.post('/logout',
    rateLimitMiddleware,
    checkCookieMiddleware,
    logoutController
)

authRouter.get('/me',
    rateLimitMiddleware,
    authMiddleware,
    getUserInfoController)
