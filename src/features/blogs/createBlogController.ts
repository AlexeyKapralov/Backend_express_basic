import { Request, Response } from 'express'
import { blogInputModelType } from './models/blogInputModelType'
import { blogViewModelType } from './models/blogViewModelType'
import { ValidationError } from 'express-validator'
import { blogsService } from '../../services/blogs.service'
import { StatusCodes } from 'http-status-codes'

export const createBlogController = async (
	req: Request<{}, {}, blogInputModelType>,
	res: Response<blogViewModelType | { errors: ValidationError[] }>
) => {
	const { name, description, websiteUrl } = req.body
	const blog = await blogsService.createBlog({ name, description, websiteUrl })
	res.status(StatusCodes.CREATED).json(blog)
	return
}
