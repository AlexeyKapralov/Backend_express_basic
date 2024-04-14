import { blogsCollection, postsCollection, PostType } from '../db/db'
import { DeleteResult, ObjectId } from 'mongodb'
import { PostInputModelType } from '../features/posts/models/postInputModelType'
import { PostViewModelType } from '../features/posts/models/postViewModelType'
import { blogsRepository } from './blogs.repository'

const getPostViewModel = (dbPost: PostType): PostViewModelType => {
	return {
		id: dbPost.id,
		title: dbPost.title,
		shortDescription: dbPost.shortDescription,
		content: dbPost.content,
		blogId: dbPost.blogId,
		blogName: dbPost.blogName,
		createdAt: dbPost.createdAt
	}
}

export const postsRepository = {
	async getPosts(query?: PostInputModelType): Promise<PostType[]> {
		if (query) {
			return (await postsCollection
				.find({
					title: { $regex: query.title || '' },
					shortDescription: { $regex: query.shortDescription || '' },
					content: { $regex: query.content || '' },
					blogId: { $regex: query.blogId || '' }
				})
				.project({
					_id: 0
				})
				.toArray()) as PostType[]
		} else {
			return (await postsCollection
				.find({})
				.project({
					_id: 0
				})
				.toArray()) as PostType[]
		}
	},
	async getPostById(id: string): Promise<PostType | false> {
		const result = (await postsCollection.findOne({ id: id })) as PostType

		if (result) {
			return getPostViewModel(result)
		} else {
			return false
		}
	},
	async createPost(data: PostInputModelType): Promise<PostViewModelType> {
		const foundBlog = await blogsCollection.findOne({ id: data.blogId })

		const newPost: PostType = {
			id: String(new ObjectId()),
			title: data.title,
			shortDescription: data.shortDescription,
			content: data.content,
			createdAt: new Date().toISOString(),
			blogId: data.blogId,
			// blogName: 'temp'
			blogName: foundBlog?.name || 'unknown name'
		}

		await postsCollection.insertOne(newPost)

		return getPostViewModel(newPost)
	},
	async updatePost(data: PostInputModelType, id: string): Promise<boolean> {
		const foundBlog = await blogsCollection.findOne({ id: data.blogId })
		const isUpdated = await postsCollection.updateOne(
			{ id: id },
			{
				$set: {
					title: data.title,
					shortDescription: data.shortDescription,
					content: data.content,
					blogId: data.blogId,
					blogName: foundBlog?.name || 'unknown name'
				}
			}
		)
		return isUpdated.matchedCount !== 0
	},
	async deletePost(id: string): Promise<boolean> {
		const result = await postsCollection.deleteOne({ id: id })
		if (result.deletedCount > 0) {
			return true
		} else {
			return false
		}
	}
}
