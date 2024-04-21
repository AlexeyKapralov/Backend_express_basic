import { ObjectId } from 'mongodb'
import { BlogType, PostType } from '../db/db'
import { postInputModelType } from '../features/posts/models/postInputModelType'
import {
	paginatorPostsViewModelType,
	postViewModelType
} from '../features/posts/models/postViewModelType'
import { postRepository } from '../repositories/posts.repository'
import { QueryPostsType } from '../utils'
import { getPostViewModel } from './blogs.service'
import { blogsRepository } from '../repositories/blogs.repository'
import { blogInputModelType } from '../features/blogs/models/blogInputModelType'

export const postsService = {
	async getAllPosts(
		query: QueryPostsType
	): Promise<paginatorPostsViewModelType | undefined> {
		const res = await postRepository.findAllPosts(query)

		const countPosts = await postRepository.countPosts()

		if (res.length !== 0) {
			return {
				pagesCount: Math.ceil(countPosts / query.pageSize),
				page: query.pageNumber,
				pageSize: query.pageSize,
				totalCount: countPosts,
				items: res.map(getPostViewModel)
			}
		} else {
			return undefined
		}
	},
	async getPostById(id: string): Promise<postViewModelType | undefined> {
		const res = await postRepository.findPostById(id)
		return res ? getPostViewModel(res) : undefined
	},
	async createPost(
		body: postInputModelType
	): Promise<postViewModelType | undefined> {
		const blog = await blogsRepository.findBlogById(body.blogId)

		if (blog !== null) {
			const post: PostType = {
				_id: String(new ObjectId()),
				title: body.title,
				shortDescription: body.shortDescription,
				content: body.content,
				blogId: body.blogId,
				blogName: blog.name,
				createdAt: String(new Date().toISOString())
			}
			const isCreated = await postRepository.createPost(post)
			return isCreated ? getPostViewModel(post) : undefined
		} else {
			return undefined
		}
	},
	async updatePost(id: string, body: postInputModelType): Promise<boolean> {
		return await postRepository.updatePost(id, body)
	},
	async deletePost(id: string): Promise<boolean> {
		return await postRepository.deletePost(id)
	}
}
