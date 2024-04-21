import { Request, Response } from 'express'
import { postViewModelType } from './models/postViewModelType'
import { postsService } from '../../services/posts.service'
import { StatusCodes } from 'http-status-codes'
import { getPostViewModel } from '../../services/blogs.service'

export const getPostByIdController = async (
	req: Request<{ id: string }>,
	res: Response<postViewModelType | undefined>
) => {
	const { id } = req.params
	const post = await postsService.getPostById(id)
	return post
		? res.status(StatusCodes.OK).json(post)
		: res.status(StatusCodes.NOT_FOUND).send()
}
