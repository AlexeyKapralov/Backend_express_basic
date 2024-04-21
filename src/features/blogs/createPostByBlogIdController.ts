import { Request, Response } from 'express'
import {
	BlogPostInputModelType,
	postInputModelType
} from '../posts/models/postInputModelType'
import { postViewModelType } from '../posts/models/postViewModelType'
import { blogsService } from '../../services/blogs.service'
import { ValidationError } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

export const createPostByBlogIdController = async (
	req: Request<{ id: string }, {}, BlogPostInputModelType>,
	res: Response<postViewModelType | { errors: ValidationError[] }>
) => {
	const result = await blogsService.createPostForBlog(req.params.id, req.body)
	if (result !== undefined) {
		res.status(StatusCodes.CREATED).json(result)
	} else {
		res.status(StatusCodes.NOT_FOUND).send()
	}
}
