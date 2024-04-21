import { Request, Response } from 'express'
import { postInputModelType } from './models/postInputModelType'
import { postViewModelType } from './models/postViewModelType'
import { postsService } from '../../services/posts.service'
import { StatusCodes } from 'http-status-codes'

export const createPostController = async (
	req: Request<{}, {}, postInputModelType>,
	res: Response<postViewModelType>
) => {
	const post = await postsService.createPost(req.body)

	post
		? res.status(StatusCodes.CREATED).send(post)
		: res.status(StatusCodes.NOT_FOUND).send()
}
