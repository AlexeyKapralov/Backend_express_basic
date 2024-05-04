import { IPaginator } from '../../common/types/paginator'
import { ICommentViewModel } from '../../features/comments/models/commentView.model'
import { db } from '../../db/db'
import { IQueryModel } from '../../features/users/models/userInput.model'
import { getCommentView } from '../../common/utils/mappers'
import { SortDirection } from 'mongodb'

export const commentsQueryRepository = {
	async getComments(postId: string, query: IQueryModel): Promise<IPaginator<ICommentViewModel>> {
		const comments = await db.getCollection().commentsCollection
			.find({postId:postId})
			.sort(query.sortBy!, query.sortDirection! as SortDirection)
			.skip((query.pageNumber! - 1) * query.pageSize!  )
			.limit(query.pageSize!)
			.toArray()

		return {
			pagesCount: Math.ceil(comments.length / query.pageSize!),
			page: query.pageNumber!,
			pageSize: query.pageSize!,
			totalCount: comments.length,
			items: comments.map(getCommentView)
		}
	},
	async getCommentById(id:string): Promise<ICommentViewModel | undefined> {
		const result = await db.getCollection().commentsCollection.findOne({_id: id})
		return result ? getCommentView(result) : undefined
	}
}