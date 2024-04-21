import { Request, Response } from 'express'
import { blogViewModelType } from './models/blogViewModelType'
import { StatusCodes } from 'http-status-codes'
import { blogsService } from '../../services/blogs.service'

export const deleteBlogByIdController = async (
	req: Request<{ id: string }>,
	res: Response<StatusCodes>
) => {
	const { id } = req.params
	res.status(await blogsService.deleteBlog(id)).json()
}
