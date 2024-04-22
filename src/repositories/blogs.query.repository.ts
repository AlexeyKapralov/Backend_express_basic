import { SortDirection } from 'mongodb'
import { blogsCollection, BlogType } from '../db/db'
import { QueryBlogType } from '../utils'

export const blogsQueryRepository = {
	async findBlogs(query: QueryBlogType): Promise<BlogType[]> {
		return await blogsCollection
			.find({
				name: { $regex: query.searchNameTerm || '', $options: 'i' }
			})
			.sort(query.sortBy, query.sortDirection as SortDirection)
			.skip((query.pageNumber - 1) * query.pageSize)
			.limit(query.pageSize)
			.toArray()
	}
}
