import {Router} from 'express'
import {createUserController} from './controllers/createUserController'
import {authMiddleware} from '../../middlewares/auth.middleware'
import {
    emailValidationForRegistration,
    loginValidation,
    pageNumberValidation,
    pageSizeValidation,
    passwordValidation,
    searchEmailTermValidation,
    searchLoginTermValidation,
    sortByValidation,
    sortDirectionValidation
} from '../../common/validation/express-validation'
import {inputValidationMiddleware} from '../../middlewares/inputValidation.middleware'
import {getUsersController} from './controllers/getUsers.controller'
import {deleteUserController} from "./controllers/deleteUserController";

export const usersRouter = Router({})

usersRouter.get(
    '/',
    sortByValidation,
    sortDirectionValidation,
    pageNumberValidation,
    pageSizeValidation,
    searchLoginTermValidation,
    searchEmailTermValidation,
    inputValidationMiddleware,
    getUsersController
)

usersRouter.post(
    '/',
    authMiddleware,
    loginValidation,
    passwordValidation,
    emailValidationForRegistration,
    inputValidationMiddleware,
    createUserController
)

usersRouter.delete(
    '/:id',
    authMiddleware,
    deleteUserController
)
