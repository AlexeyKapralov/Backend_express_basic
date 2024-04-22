import { SortDirection } from 'mongodb'
import { blogsCollection, BlogType } from '../db/db'
import { QueryBlogType } from '../utils'
import { paginatorBlogViewModelType } from '../features/blogs/models/blogViewModelType'
import { blogsRepository } from './blogs.repository'
import { getBlogViewModel } from '../services/blogs.service'

export const blogsQueryRepository = {
	async findBlogs(
		query: QueryBlogType
	): Promise<paginatorBlogViewModelType | undefined> {
		const result = await blogsCollection
			.find({
				name: { $regex: query.searchNameTerm || '', $options: 'i' }
			})
			.sort(query.sortBy, query.sortDirection as SortDirection)
			.skip((query.pageNumber - 1) * query.pageSize)
			.limit(query.pageSize)
			.toArray()

		const countDocs = await blogsRepository.countBlogs(
			query.searchNameTerm ? query.searchNameTerm : undefined
		)
		if (result.length > 0) {
			const resultView = {
				pagesCount: Math.ceil(countDocs / query.pageSize),
				page: query.pageNumber,
				pageSize: query.pageSize,
				totalCount: countDocs,
				items: result.map(getBlogViewModel)
			}
			return resultView as paginatorBlogViewModelType
		} else {
			return undefined
		}
	}
}
