import { Request, Response } from 'express'
import { blogInputModelType } from './models/blogInputModelType'
import { blogViewModelType } from './models/blogViewModelType'
import { ValidationError } from 'express-validator'
import { blogsService } from '../../services/blogs.service'
import { StatusCodes } from 'http-status-codes'

export const updateBlogController = async (
	req: Request<{ id: string }, {}, blogInputModelType>,
	res: Response<StatusCodes | { errors: ValidationError[] }>
) => {
	const id = req.params.id
	const { name, description, websiteUrl } = req.body
	const status = await blogsService.updateBlog(id, {
		name,
		description,
		websiteUrl
	})
	res.sendStatus(status)
}
