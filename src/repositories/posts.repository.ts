import { SortDirection } from 'mongodb'
import { blogsCollection, postsCollection, PostType } from '../db/db'
import { QueryPostsType } from '../utils'
import { postInputModelType } from '../features/posts/models/postInputModelType'

export const postRepository = {
	async countPosts(id?: string) {
		return id
			? await postsCollection.countDocuments({ blogId: id })
			: await postsCollection.countDocuments()
	},
	async getPostsByBlogId(id: string, query: QueryPostsType) {
		return await postsCollection
			.find({ blogId: id })
			.sort(query.sortBy, query.sortDirection as SortDirection)
			.skip((query.pageNumber - 1) * query.pageSize)
			.limit(query.pageSize)
			.toArray()
	},
	async createPostForBlog(post: PostType) {
		return await postsCollection.insertOne(post)
	},
	async findPostById(id: string): Promise<PostType | null> {
		return await postsCollection.findOne({
			_id: id
		})
	},
	async findAllPosts(query: QueryPostsType): Promise<PostType[]> {
		return await postsCollection
			.find({})
			.sort(query.sortBy, query.sortDirection as SortDirection)
			.skip((query.pageNumber - 1) * query.pageSize)
			.limit(query.pageSize)
			.toArray()
	},
	async createPost(post: PostType): Promise<boolean> {
		const result = await postsCollection.insertOne(post)
		return result.acknowledged ? true : false
	},
	async updatePost(id: string, body: postInputModelType): Promise<boolean> {
		const blog = await blogsCollection.findOne({ _id: body.blogId })

		if (blog === null) {
			return false
		} else {
			const result = await postsCollection.updateOne(
				{ _id: id },
				{
					$set: {
						title: body.title,
						shortDescription: body.shortDescription,
						content: body.content,
						blogId: body.blogId,
						blogName: blog.name
					}
				}
			)
			return result.matchedCount > 0 ? true : false
		}
	},
	async deletePost(id: string): Promise<boolean> {
		const result = await postsCollection.deleteOne({ _id: id })
		return result.deletedCount > 0 ? true : false
	}
}
