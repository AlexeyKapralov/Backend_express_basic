import { query, Request, Response } from 'express'
import { blogsCollection, BlogType } from '../../db/db'
import { StatusCodes } from 'http-status-codes'
import {
	blogViewModelType,
	paginatorBlogViewModelType
} from './models/blogViewModelType'
import { blogsService } from '../../services/blogs.service'
import { getQueryBlogsWithDefault, QueryBlogType } from '../../utils'

export const getBlogsController = async (
	req: Request<{}, {}, {}, { [key: string]: string | undefined }>,
	res: Response<paginatorBlogViewModelType>
) => {
	const query: QueryBlogType = getQueryBlogsWithDefault(req.query)

	const blogs = await blogsService.findBlogs(query)

	return blogs
		? res.status(StatusCodes.OK).json(blogs)
		: res.status(StatusCodes.NOT_FOUND).json()
}
