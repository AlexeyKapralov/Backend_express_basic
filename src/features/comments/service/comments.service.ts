import { ICommentViewModel } from '../models/commentView.model'
import { ResultType } from '../../../common/types/result.type'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import { ICommentInputModel } from '../models/commentInput.model'
import { commentsRepository } from '../repository/comments.repository'
import {usersRepository} from "../../users/repository/users.repository";

export const commentsService = {

	async updateComment(userId: string, commentId: string, data: ICommentInputModel): Promise<ResultType<ICommentViewModel | null>> {

		const user = await usersRepository.findUserById(userId)
		const comment = await commentsRepository.getCommentById(commentId)

		if (!comment || !user) {
			return {
				status: ResultStatus.NotFound,
				data: null
			}
		}

		if (comment.commentatorInfo.userId !== user._id) {
			return {
				status: ResultStatus.Forbidden,
				data: null
			}
		}

		const result = await commentsRepository.updateComment(commentId, data)

		if (result) {
			return {
				status: ResultStatus.Success,
				data: null
			}
		} else {
			return {
				status: ResultStatus.NotFound,
				data: null
			}
		}
	},
	async deleteComment(userId: string, commentId: string): Promise<ResultType> {

		const user = await usersRepository.findUserById(userId)
		const comment = await commentsRepository.getCommentById(commentId)

		if (!comment || !user) {
			return {
				status: ResultStatus.NotFound,
				data: null
			}
		}

		if (comment.commentatorInfo.userId !== user._id) {
			return {
				status: ResultStatus.Forbidden,
				data: null
			}
		}
		const result = await commentsRepository.deleteComment(commentId)

		return result
			? {
				status: ResultStatus.Success,
				data: null
			}
			: {
				status: ResultStatus.NotFound,
				data: null
			}
	}
}