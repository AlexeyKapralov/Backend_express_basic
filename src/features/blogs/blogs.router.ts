import { Router } from 'express'
import { getBlogsController } from './getBlogsController'
import { createBlogController } from './createBlogController'
import { body } from 'express-validator'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { inputValidationMiddleware } from '../../middlewares/inputValidationMiddleware'
import { getBlogByIdController } from './getBlogByIdController'
import { updateBlogController } from './updateBlogController'
import { deleteBlogByIdController } from './deleteBlogByIdController'
import { getPostsByBlogIdController } from './getPostsByBlogIdController'
import { createPostByBlogIdController } from './createPostByBlogIdController'

const nameValidation = body('name')
	.trim()
	.isLength({ min: 1, max: 15 })
	.exists()
// .customSanitizer(value => {
// 	return value.toString()
// })

const titleValidation = body('title')
	.trim()
	.isLength({ min: 1, max: 30 })
	.exists()
// .customSanitizer(value => {
// 	return value.toString()
// })

const contentValidation = body('content')
	.trim()
	.isLength({ min: 1, max: 100 })
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

const shortDescriptionValidation = body('shortDescription')
	.trim()
	.isLength({ min: 1, max: 100 })
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

export const blogsRouter = Router({})

blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id/posts', getPostsByBlogIdController)

blogsRouter.get('/:id', getBlogByIdController)

blogsRouter.post(
	'/:id/posts',
	authMiddleware,
	titleValidation,
	shortDescriptionValidation,
	contentValidation,
	inputValidationMiddleware,

	createPostByBlogIdController
)
blogsRouter.post(
	'/',
	authMiddleware,
	nameValidation,
	descriptionValidation,
	websiteUrlValidation,
	inputValidationMiddleware,

	createBlogController
)
blogsRouter.put(
	'/:id',
	authMiddleware,
	nameValidation,
	descriptionValidation,
	websiteUrlValidation,
	inputValidationMiddleware,

	updateBlogController
)
blogsRouter.delete(
	'/:id',
	authMiddleware,

	deleteBlogByIdController
)
