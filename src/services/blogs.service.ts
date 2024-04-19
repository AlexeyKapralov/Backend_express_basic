import { blogsRepository } from '../repositories/blogs.repository'
import { BlogType } from '../db/db'
import {
	blogViewModelType,
	paginatorBlogViewModelType
} from '../features/blogs/models/blogViewModelType'
import { QueryType } from '../utils'
import { blogInputModelType } from '../features/blogs/models/blogInputModelType'
import { ObjectId } from 'mongodb'

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
	},

	async createBlog(body: blogInputModelType): Promise<blogViewModelType> {
		const blog: BlogType = {
			_id: String(new ObjectId()),
			name: body.name,
			description: body.description,
			websiteUrl: body.websiteUrl,
			createdAt: String(new Date().toISOString()),
			isMembership: true
		}
		await blogsRepository.createBlog(blog)

		return getBlogViewModel(blog)
	}
}
