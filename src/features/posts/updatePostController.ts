import { Request, Response } from 'express'
import { postInputModelType } from './models/postInputModelType'
import { StatusCodes } from 'http-status-codes'
import { postsService } from '../../services/posts.service'

export const updatePostController = async (
	req: Request<{ id: string }, {}, postInputModelType>,
	res: Response<StatusCodes>
) => {
	const { id } = req.params
	const isUpdated = await postsService.updatePost(id, req.body)
	isUpdated
		? res.status(StatusCodes.NO_CONTENT).send()
		: res.status(StatusCodes.NOT_FOUND).send()
}
