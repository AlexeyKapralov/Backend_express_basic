import { Request, Response } from 'express'
import { paginatorPostsViewModelType } from './models/postViewModelType'
import { getQueryPostsWithDefault, QueryPostsType } from '../../utils'
import { postsService } from '../../services/posts.service'
import { StatusCodes } from 'http-status-codes'
export const getPostsController = async (
	req: Request<{}, {}, {}, { [key: string]: string }>,
	res: Response<paginatorPostsViewModelType>
) => {
	const query: QueryPostsType = getQueryPostsWithDefault(req.query)

	const posts = await postsService.getAllPosts(query)

	posts
		? res.status(StatusCodes.OK).json(posts)
		: res.status(StatusCodes.NOT_FOUND).json()
}
