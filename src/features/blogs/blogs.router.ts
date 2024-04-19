import { Router } from 'express'
import { getBlogsController } from './getBlogsController'
import { createBlogsController } from './createBlogsController'
import { body } from 'express-validator'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { inputValidationMiddleware } from '../../middlewares/inputValidationMiddleware'

const nameValidation = body('name')
	.trim()
	.isLength({ min: 1, max: 15 })
	.exists()
// .customSanitizer(value => {
// 	return value.toString()
// })

const descriptionValidation = body('description')
	.trim()
	.isLength({ min: 1, max: 500 })
	.exists()
// .customSanitizer(value => {
// 	return value.toString()
// })
const websiteUrlValidation = body('websiteUrl')
	.isLength({ min: 1, max: 100 })
	.exists()
	// .customSanitizer(value => {
	// 	return value.toString()
	// })
	.isURL()

export const BlogsRouter = Router({})

BlogsRouter.get('/', getBlogsController)

BlogsRouter.post(
	'/',
	authMiddleware,
	nameValidation,
	descriptionValidation,
	websiteUrlValidation,
	inputValidationMiddleware,

	createBlogsController
)
