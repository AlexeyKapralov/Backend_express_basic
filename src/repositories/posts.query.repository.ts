import { SortDirection } from 'mongodb'
import { postsCollection, PostType } from '../db/db'
import { QueryPostsType } from '../utils'
import { postRepository } from './posts.repository'
import { getPostViewModel } from '../services/blogs.service'
import { paginatorPostsViewModelType } from '../features/posts/models/postViewModelType'

export const postQueryRepository = {
	async getPostsByBlogId(
		id: string,
		query: QueryPostsType
	): Promise<paginatorPostsViewModelType | null> {
		const result = await postsCollection
			.find({ blogId: id })
			.sort(query.sortBy, query.sortDirection as SortDirection)
			.skip((query.pageNumber - 1) * query.pageSize)
			.limit(query.pageSize)
			.toArray()

		if (result.length !== 0) {
			const countPosts = await postRepository.countPosts(id)

			const posts = result.map(getPostViewModel)
			const resultView = {
				pagesCount: Math.ceil(countPosts / query.pageSize),
				page: query.pageNumber,
				pageSize: query.pageSize,
				totalCount: countPosts,
				items: posts
			}
			return resultView
		} else {
			return null
		}
	},
	async findAllPosts(
		query: QueryPostsType
	): Promise<paginatorPostsViewModelType | undefined> {
		const res = await postsCollection
			.find({})
			.sort(query.sortBy, query.sortDirection as SortDirection)
			.skip((query.pageNumber - 1) * query.pageSize)
			.limit(query.pageSize)
			.toArray()

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
	}
}
