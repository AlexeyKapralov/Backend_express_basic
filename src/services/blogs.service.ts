import { blogsRepository } from '../repositories/blogs.repository'
import { blogsCollection, BlogType, PostType } from '../db/db'
import {
	blogViewModelType,
	paginatorBlogViewModelType
} from '../features/blogs/models/blogViewModelType'
import { QueryBlogType } from '../utils'
import { blogInputModelType } from '../features/blogs/models/blogInputModelType'
import { ObjectId } from 'mongodb'
import { StatusCodes } from 'http-status-codes'
import { postRepository } from '../repositories/posts.repository'
import {
	paginatorPostsViewModelType,
	postViewModelType
} from '../features/posts/models/postViewModelType'
import { BlogPostInputModelType } from '../features/posts/models/postInputModelType'
import { blogsQueryRepository } from '../repositories/blogs.query.repository'
import { postQueryRepository } from '../repositories/posts.query.repository'

export const getBlogViewModel = (blog: BlogType): blogViewModelType => {
	return {
		id: blog._id,
		name: blog.name,
		description: blog.description,
		websiteUrl: blog.websiteUrl,
		createdAt: blog.createdAt,
		isMembership: blog.isMembership
	}
}

export const getPostViewModel = (post: PostType): postViewModelType => {
	return {
		id: post._id,
		title: post.title,
		shortDescription: post.shortDescription,
		content: post.content,
		blogId: post.blogId,
		blogName: post.blogName,
		createdAt: post.createdAt
	}
}

export const blogsService = {
	async findBlogs(
		query: QueryBlogType
	): Promise<paginatorBlogViewModelType | undefined> {
		return await blogsQueryRepository.findBlogs(query)
	},

	async findBlogById(id: string): Promise<blogViewModelType | null> {
		const foundBlog = await blogsRepository.findBlogById(id)
		return foundBlog ? getBlogViewModel(foundBlog) : null
	},

	async createBlog(body: blogInputModelType): Promise<blogViewModelType> {
		const blog: BlogType = {
			_id: String(new ObjectId()),
			name: body.name,
			description: body.description,
			websiteUrl: body.websiteUrl,
			createdAt: String(new Date().toISOString()),
			isMembership: false
		}
		await blogsRepository.createBlog(blog)

		return getBlogViewModel(blog)
	},

	async updateBlog(id: string, body: blogInputModelType): Promise<StatusCodes> {
		const isUpdated = await blogsRepository.updateBlog(id, body)

		return isUpdated ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND
	},

	async deleteBlog(id: string): Promise<StatusCodes> {
		const isUpdated = await blogsRepository.deleteBlog(id)

		return isUpdated ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND
	},
	async findPostsByBlogId(
		id: string,
		query: QueryBlogType
	): Promise<paginatorPostsViewModelType | null> {
		return await postQueryRepository.getPostsByBlogId(id, query)
	},
	async createPostForBlog(
		id: string,
		body: BlogPostInputModelType
	): Promise<postViewModelType | undefined> {
		const blog = await blogsCollection.findOne({
			_id: id
		})

		if (blog !== null) {
			const post: PostType = {
				_id: String(new ObjectId()),
				title: body.title,
				shortDescription: body.shortDescription,
				content: body.content,
				blogId: blog!._id,
				blogName: blog!.name,
				createdAt: new Date().toISOString()
			}

			const result = await postRepository.createPostForBlog(post)
			if (result.acknowledged === true) {
				return getPostViewModel(post)
			}
		} else return undefined
	}
}
