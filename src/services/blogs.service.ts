import { blogsRepository } from '../repositories/blogs.repository'
import { BlogType } from '../db/db'
import {
	blogViewModelType,
	paginatorBlogViewModelType
} from '../features/blogs/models/blogViewModelType'
import { QueryType } from '../utils'

const getBlogViewModel = (blog: BlogType): blogViewModelType => {
	return {
		id: blog._id,
		name: blog.name,
		description: blog.description,
		websiteUrl: blog.websiteUrl,
		createdAt: blog.createdAt,
		isMembership: blog.isMembership
	}
}

export const blogsService = {
	async findBlogs(query: QueryType): Promise<paginatorBlogViewModelType> {
		const countBlogs = await blogsRepository.countBlogs()
		const result = await blogsRepository.findBlogs(query)
		const blogs = result.map(getBlogViewModel)
		const resultView = {
			pagesCount: Math.ceil(countBlogs / query.pageSize),
			page: query.pageNumber,
			pageSize: query.pageSize,
			totalCount: countBlogs,
			items: blogs
		}
		return resultView as paginatorBlogViewModelType
	}
}
