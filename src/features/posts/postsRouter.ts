import { Router } from 'express'
import { getPostsController } from './getPostsController'
import { createPostController } from './createPostController'
import { body } from 'express-validator'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { inputValidationMiddleware } from '../../middlewares/inputValidationMiddleware'
import { getPostByIdController } from './getPostByIdController.'
import { updatePostController } from './updatePostController'
import { deletePostController } from './deletePostController'
import { blogsCollection } from '../../db/db'

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

const shortDescriptionValidation = body('shortDescription')
	.trim()
	.isLength({ min: 1, max: 100 })
	.exists()
// .customSanitizer(value => {
// 	return value.toString()
// })
const blogIdValidation = body('blogId')
	.trim()
	.custom(async value => {
		const blog = await blogsCollection.findOne({ _id: value })
		if (blog === null) {
			throw new Error('blog not found')
		}
	})

export const postsRouter = Router({})

postsRouter.get('/', getPostsController)
postsRouter.get('/:id', getPostByIdController)
postsRouter.post(
	'/',

	authMiddleware,
	titleValidation,
	contentValidation,
	shortDescriptionValidation,
	blogIdValidation,
	inputValidationMiddleware,

	createPostController
)
postsRouter.put(
	'/:id',

	authMiddleware,
	titleValidation,
	contentValidation,
	shortDescriptionValidation,
	blogIdValidation,
	inputValidationMiddleware,

	updatePostController
)

postsRouter.delete(
	'/:id',

	authMiddleware,

	deletePostController
)
