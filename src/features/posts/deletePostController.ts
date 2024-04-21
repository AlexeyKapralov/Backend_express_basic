import { Request, Response } from 'express'
import { postsService } from '../../services/posts.service'
import { StatusCodes } from 'http-status-codes'

export const deletePostController = async (
	req: Request,
	res: Response<StatusCodes>
) => {
	const { id } = req.params
	const isDeleted = await postsService.deletePost(id)
	return isDeleted
		? res.status(StatusCodes.NO_CONTENT).send()
		: res.status(StatusCodes.NOT_FOUND).send()
}
