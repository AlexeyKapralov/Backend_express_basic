import {Router} from 'express'
import {authMiddleware} from '../../middlewares/auth.middleware'
import {
    codeValidation, emailValidationForRecovery,
    emailValidationForRegistration, emailValidationForResend,
    loginOrEmailValidation,
    loginValidation, newPasswordValidation,
    passwordValidation, recoveryCodeValidation
} from '../../common/validation/express-validation'
import {inputValidationMiddleware} from '../../middlewares/inputValidation.middleware'
import {rateLimitMiddleware} from "../../middlewares/rateLimit.middleware";
import {checkCookieMiddleware} from "../../middlewares/checkCookie.middleware";
import {container} from "../../ioc";
import {AuthController} from "./auth.controller";

export const authRouter = Router({})
const authController = container.resolve(AuthController)

authRouter.post('/login',
    rateLimitMiddleware,
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware,
    authController.login.bind(authController)
)

authRouter.post(
    '/password-recovery',
    rateLimitMiddleware,
    emailValidationForRecovery,
    inputValidationMiddleware,
    authController.passwordRecovery.bind(authController)
)

authRouter.post('/new-password',
    rateLimitMiddleware,
    newPasswordValidation,
    recoveryCodeValidation,
    inputValidationMiddleware,
    authController.newPassword.bind(authController)
)

authRouter.post('/refresh-token',
    rateLimitMiddleware,
    checkCookieMiddleware,
    authController.refreshToken.bind(authController)
)

authRouter.post('/registration',
    rateLimitMiddleware,
    loginValidation,
    passwordValidation,
    emailValidationForRegistration,
    inputValidationMiddleware,
    authController.registration.bind(authController)
)

authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    codeValidation,
    inputValidationMiddleware,
    authController.registrationConfirmation.bind(authController)
)
authRouter.post('/registration-email-resending',
    rateLimitMiddleware,
    emailValidationForResend,
    inputValidationMiddleware,
    authController.emailResending.bind(authController)
)
authRouter.post('/logout',
    rateLimitMiddleware,
    checkCookieMiddleware,
    authController.logout.bind(authController)
)

authRouter.get('/me',
    rateLimitMiddleware,
    authMiddleware,
    authController.getUserInfo.bind(authController)
)