import { IPaginator } from '../../common/types/paginator'
import { ICommentViewModel } from '../../features/comments/models/commentView.model'
import { db } from '../../db/db'
import { getCommentView } from '../../common/utils/mappers'
import { SortDirection } from 'mongodb'
import { IQueryModel } from '../../common/types/query.model'

export const commentsQueryRepository = {
	async getComments(postId: string, query: IQueryModel): Promise<IPaginator<ICommentViewModel> | undefined> {
		const post = await db.getCollection().postsCollection.findOne({_id: postId})

		if (!post) {
			return undefined
		}

		const comments = await db.getCollection().commentsCollection
			.find({postId:postId})
			.sort(query.sortBy!, query.sortDirection! as SortDirection)
			.skip((query.pageNumber! - 1) * query.pageSize!  )
			.limit(query.pageSize!)
			.toArray()

		const commentsCount = await db.getCollection().commentsCollection
			.countDocuments({postId:postId})


		return {
			pagesCount: Math.ceil(commentsCount / query.pageSize!),
			page: query.pageNumber!,
			pageSize: query.pageSize!,
			totalCount: commentsCount,
			items: comments.map(getCommentView)
		}
	},
	async getCommentById(id:string): Promise<ICommentViewModel | undefined> {
		const result = await db.getCollection().commentsCollection.findOne({_id: id})
		return result ? getCommentView(result) : undefined
	}
}