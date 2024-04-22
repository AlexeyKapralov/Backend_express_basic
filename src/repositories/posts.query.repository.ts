import { SortDirection } from 'mongodb'
import { blogsCollection, postsCollection, PostType } from '../db/db'
import { QueryPostsType } from '../utils'
import { postInputModelType } from '../features/posts/models/postInputModelType'

export const postQueryRepository = {
	async getPostsByBlogId(id: string, query: QueryPostsType) {
		return await postsCollection
			.find({ blogId: id })
			.sort(query.sortBy, query.sortDirection as SortDirection)
			.skip((query.pageNumber - 1) * query.pageSize)
			.limit(query.pageSize)
			.toArray()
	},
	async findAllPosts(query: QueryPostsType): Promise<PostType[]> {
		return await postsCollection
			.find({})
			.sort(query.sortBy, query.sortDirection as SortDirection)
			.skip((query.pageNumber - 1) * query.pageSize)
			.limit(query.pageSize)
			.toArray()
	}
}
