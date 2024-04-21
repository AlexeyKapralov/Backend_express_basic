import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { blogsService } from '../../services/blogs.service'
import { getQueryBlogsWithDefault, QueryBlogType } from '../../utils'
import { paginatorPostsViewModelType } from '../posts/models/postViewModelType'

export const getPostsByBlogIdController = async (
	req: Request<{ id: string }, {}, {}, { [key: string]: string | undefined }>,
	res: Response<paginatorPostsViewModelType>
) => {
	const query: QueryBlogType = getQueryBlogsWithDefault(req.query)
	const id: string = req.params.id
	const posts = await blogsService.findPostsByBlogId(id, query)

	if (posts !== null) {
		res.status(StatusCodes.OK).json(posts)
	} else {
		res.status(StatusCodes.NOT_FOUND).send()
	}
}
