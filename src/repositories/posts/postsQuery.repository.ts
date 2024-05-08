import { SortDirection } from 'mongodb'
import { db } from '../../db/db'
import { getPostViewModel } from '../../common/utils/mappers'
import { IPostViewModel } from '../../features/posts/models/postView.model'
import { IPaginator } from '../../common/types/paginator'
import { IQueryModel } from '../../common/types/query.model'

export const postsQueryRepository = {
	async getPosts(query: IQueryModel): Promise<IPaginator<IPostViewModel>> {
		const posts = await db.getCollection().postsCollection
			.find()
			.skip((query.pageNumber! - 1) * query.pageSize!)
			.limit(query.pageSize!)
			.sort(query.sortBy!, query.sortDirection as SortDirection)
			.toArray()

		const countDocs = await db.getCollection().postsCollection.countDocuments()

		return {
			pagesCount: Math.ceil(countDocs / query.pageSize!),
			page: query.pageNumber!,
			pageSize: query.pageSize!,
			totalCount: countDocs,
			items: posts.map(getPostViewModel)
		}

	},
	async getPostById(id: string): Promise<IPostViewModel | undefined> {
		const result = await db.getCollection().postsCollection.findOne({
			_id: id
		})
		return result ? getPostViewModel(result) : undefined
	}
}