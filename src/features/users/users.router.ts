import {Router} from 'express'
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
import {container} from "../../ioc";
import {UsersController} from "./users.controller";

export const usersRouter = Router({})
const usersController = container.resolve(UsersController)

usersRouter.get(
    '/',
    sortByValidation,
    sortDirectionValidation,
    pageNumberValidation,
    pageSizeValidation,
    searchLoginTermValidation,
    searchEmailTermValidation,
    inputValidationMiddleware,
    usersController.getUsers.bind(usersController)
)

usersRouter.post(
    '/',
    authMiddleware,
    loginValidation,
    passwordValidation,
    emailValidationForRegistration,
    inputValidationMiddleware,
    usersController.createUser.bind(usersController)
)

usersRouter.delete(
    '/:id',
    authMiddleware,
    usersController.deleteUser.bind(usersController)
)
