import { SortDirection } from 'mongodb'
import { blogsCollection, BlogType } from '../db/db'
import { QueryType } from '../utils'

export const blogsRepository = {
	async findBlogs(query: QueryType): Promise<BlogType[]> {
		return await blogsCollection
			.find({
				name: { $regex: query.searchNameTerm || '' }
			})
			.sort(query.sortBy, query.sortDirection as SortDirection)
			.skip((query.pageNumber - 1) * query.pageSize)
			.limit(query.pageSize)
			.toArray()
	},
	async countBlogs(): Promise<number> {
		return await blogsCollection.countDocuments()
	},
	async createBlog(blog: BlogType): Promise<boolean> {
		const result = await blogsCollection.insertOne(blog)

		return result.acknowledged ? true : false
	}
}
