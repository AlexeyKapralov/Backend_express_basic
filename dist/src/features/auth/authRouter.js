"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const express_validation_1 = require("../../common/validation/express-validation");
const inputValidation_middleware_1 = require("../../middlewares/inputValidation.middleware");
const rateLimit_middleware_1 = require("../../middlewares/rateLimit.middleware");
const checkCookie_middleware_1 = require("../../middlewares/checkCookie.middleware");
const ioc_1 = require("../../ioc");
const auth_controller_1 = require("./auth.controller");
exports.authRouter = (0, express_1.Router)({});
const authController = ioc_1.container.resolve(auth_controller_1.AuthController);
exports.authRouter.post('/login', rateLimit_middleware_1.rateLimitMiddleware, express_validation_1.loginOrEmailValidation, express_validation_1.passwordValidation, inputValidation_middleware_1.inputValidationMiddleware, authController.login.bind(authController));
exports.authRouter.post('/password-recovery', rateLimit_middleware_1.rateLimitMiddleware, express_validation_1.emailValidationForRecovery, inputValidation_middleware_1.inputValidationMiddleware, authController.passwordRecovery.bind(authController));
exports.authRouter.post('/new-password', rateLimit_middleware_1.rateLimitMiddleware, express_validation_1.newPasswordValidation, express_validation_1.recoveryCodeValidation, inputValidation_middleware_1.inputValidationMiddleware, authController.newPassword.bind(authController));
exports.authRouter.post('/refresh-token', rateLimit_middleware_1.rateLimitMiddleware, checkCookie_middleware_1.checkCookieMiddleware, authController.refreshToken.bind(authController));
exports.authRouter.post('/registration', rateLimit_middleware_1.rateLimitMiddleware, express_validation_1.loginValidation, express_validation_1.passwordValidation, express_validation_1.emailValidationForRegistration, inputValidation_middleware_1.inputValidationMiddleware, authController.registration.bind(authController));
exports.authRouter.post('/registration-confirmation', rateLimit_middleware_1.rateLimitMiddleware, express_validation_1.codeValidation, inputValidation_middleware_1.inputValidationMiddleware, authController.registrationConfirmation.bind(authController));
exports.authRouter.post('/registration-email-resending', rateLimit_middleware_1.rateLimitMiddleware, express_validation_1.emailValidationForResend, inputValidation_middleware_1.inputValidationMiddleware, authController.emailResending.bind(authController));
exports.authRouter.post('/logout', rateLimit_middleware_1.rateLimitMiddleware, checkCookie_middleware_1.checkCookieMiddleware, authController.logout.bind(authController));
exports.authRouter.get('/me', rateLimit_middleware_1.rateLimitMiddleware, auth_middleware_1.authMiddleware, authController.getUserInfo.bind(authController));
