import { Request, Response } from 'express'
import { blogViewModelType } from './models/blogViewModelType'
import { StatusCodes } from 'http-status-codes'
import { blogsService } from '../../services/blogs.service'

export const getBlogByIdController = async (
	req: Request<{ id: string }>,
	res: Response<blogViewModelType>
) => {
	const { id } = req.params
	const blog = await blogsService.findBlogById(id)

	return blog
		? res.status(StatusCodes.OK).json(blog)
		: res.status(StatusCodes.NOT_FOUND).send()
}
