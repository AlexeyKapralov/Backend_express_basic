import express, { Request, Response, Router } from 'express'
import { IUserInputModel } from './models/user.input.model'
import { IUserViewModel } from './models/user.view.model'
import { usersService } from '../../service/users.service'
import { createPostController } from './controllers/create.post.controller'
import { SETTINGS } from '../../common/config/settings'
import { authMiddleware } from '../../middlewares/auth.middleware'
import {
	emailValidation,
	loginValidation,
	pageNumberValidation,
	pageSizeValidation,
	passwordValidation,
	searchEmailTermValidation,
	searchLoginTermValidation,
	sortByValidation,
	sortDirectionValidation
} from '../../common/validation/express-validation'
import { inputValidationMiddleware } from '../../middlewares/input.validation.middleware'
import { getUsersController } from './controllers/get.users.controller'

export const usersRouter = Router({})

usersRouter.post(
	'/',
	authMiddleware,
	loginValidation,
	passwordValidation,
	emailValidation,
	inputValidationMiddleware,
	createPostController
)

usersRouter.get(
	'/',
	sortByValidation,
	sortDirectionValidation,
	pageNumberValidation,
	pageSizeValidation,
	searchLoginTermValidation,
	searchEmailTermValidation,
	getUsersController
)
