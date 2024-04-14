import { Request, Response, Router } from 'express'
import { BlogInputModelType } from './models/blogInputModelType'
import { BlogViewModelType } from './models/blogViewModelType'
import { blogsRepository } from '../../repositories/blogs.repository'
import { StatusCodes } from 'http-status-codes'
import { body, ValidationError } from 'express-validator'
import { inputValidationMiddleware } from '../../middlewares/inputValidationMiddleware'
import { authMiddleware } from '../../middlewares/auth.middleware'

const nameValidation = body('name')
	// name: string,maxlength 15
	// .optional()
	.trim()
	.isLength({ min: 1, max: 15 })
	.exists()
// .customSanitizer(value => {
// 	return value.toString()
// })

const descriptionValidation = body('description')
	// description: string,
	// .optional()
	.trim()
	.isLength({ min: 1, max: 500 })
	.exists()
// .customSanitizer(value => {
// 	return value.toString()
// })
const websiteUrlValidation = body('websiteUrl')
	// websiteUrl: string, pattern for url
	// .optional()
	.isLength({ min: 1, max: 100 })
	.exists()
	// .customSanitizer(value => {
	// 	return value.toString()
	// })
	.isURL()

export const blogsRouter = Router({})

blogsRouter.get(
	'/',
	async (
		req: Request<{}, {}, {}, BlogInputModelType>,
		res: Response<BlogViewModelType[] | BlogInputModelType>
	) => {
		if (req.query.websiteUrl || req.query.name || req.query.description) {
			const result = await blogsRepository.getBlogs(req.query)
			res.send(result)
		} else {
			const result = await blogsRepository.getBlogs()
			res.send(result)
		}
	}
)

blogsRouter.post(
	'/',

	authMiddleware,
	nameValidation,
	descriptionValidation,
	websiteUrlValidation,
	inputValidationMiddleware,

	async (
		req: Request<{}, {}, BlogInputModelType>,
		res: Response<BlogViewModelType | { errors: ValidationError[] }>
	) => {
		const result = await blogsRepository.createBlog(req.body)
		if (result) {
			res.status(StatusCodes.CREATED).json(result)
		} else {
			res.sendStatus(StatusCodes.BAD_REQUEST)
		}
	}
)

blogsRouter.get(
	'/:id',
	async (
		req: Request<{ id: string }>,
		res: Response<BlogViewModelType | { errors: ValidationError[] }>
	) => {
		const result = await blogsRepository.getBlogsById(req.params.id)

		if (result) {
			res.status(StatusCodes.OK).json(result)
		} else {
			res.status(StatusCodes.NOT_FOUND).json()
		}
	}
)

blogsRouter.put(
	'/:id',

	authMiddleware,
	nameValidation,
	descriptionValidation,
	websiteUrlValidation,
	inputValidationMiddleware,

	async (
		req: Request<{ id: string }, {}, BlogInputModelType>,
		res: Response<{ errors: ValidationError[] }>
	) => {
		const result = await blogsRepository.updateBlog(req.body, req.params.id)

		if (!result) {
			res.status(StatusCodes.NOT_FOUND).json()
		} else {
			res.status(StatusCodes.NO_CONTENT).json()
		}
	}
)

blogsRouter.delete(
	'/:id',
	authMiddleware,
	async (req: Request<{ id: string }>, res: Response) => {
		const result = await blogsRepository.deleteBlog(req.params.id)
		if (result) {
			res.status(StatusCodes.NO_CONTENT).json()
		} else {
			res.status(StatusCodes.NOT_FOUND).json()
		}
	}
)
