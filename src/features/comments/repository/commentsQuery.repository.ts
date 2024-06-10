import { IPaginator } from '../../../common/types/paginator'
import { ICommentViewModel } from '../models/commentView.model'
import { SortDirection } from 'mongodb'
import { IQueryModel } from '../../../common/types/query.model'
import {getCommentView} from "../mappers/commentsMappers";
import {PostModel} from "../../posts/domain/post.entity";
import {CommentsModel} from "../domain/comments.entity";

export const commentsQueryRepository = {
	async getComments(postId: string, query: IQueryModel, userId: string = 'default'): Promise<IPaginator<ICommentViewModel> | undefined> {
		const post = await PostModel.findOne({_id: postId})

		if (!post) {
			return undefined
		}

		const comments = await CommentsModel
			.find({postId:postId})
			.sort({[query.sortBy!]: query.sortDirection! as SortDirection})
			.skip((query.pageNumber! - 1) * query.pageSize!  )
			.limit(query.pageSize!)
			.lean()

		const commentsCount = await CommentsModel
			.countDocuments({postId:postId})

		return {
			pagesCount: Math.ceil(commentsCount / query.pageSize!),
			page: query.pageNumber!,
			pageSize: query.pageSize!,
			totalCount: commentsCount,
			items: comments.map( i => getCommentView(i, userId))
		}
	},
	async getCommentById(id:string, userId: string = 'default'): Promise<ICommentViewModel | undefined> {

		const result = await CommentsModel.findOne({_id: id})
		if (userId !== 'default') {
			return result ? getCommentView(result, userId) : undefined
		}
		return result ? getCommentView(result) : undefined
	}
}