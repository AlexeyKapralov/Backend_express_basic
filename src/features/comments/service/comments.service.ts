import { ICommentViewModel } from '../models/commentView.model'
import { ResultType } from '../../../common/types/result.type'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import { ICommentInputModel } from '../models/commentInput.model'
import {UsersRepository} from "../../users/repository/users.repository";
import {CommentsRepository} from "../repository/comments.repository";

export class CommentsService {
	protected usersRepository
	protected commentsRepository
	constructor(usersRepository: UsersRepository, commentsRepository: CommentsRepository) {
		this.usersRepository = usersRepository
		this.commentsRepository = commentsRepository
	}

	async updateComment(userId: string, commentId: string, data: ICommentInputModel): Promise<ResultType<ICommentViewModel | null>> {

		const user = await this.usersRepository.findUserById(userId)
		const comment = await this.commentsRepository.getCommentById(commentId)

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

		const result = await this.commentsRepository.updateComment(commentId, data)

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
	}
	async deleteComment(userId: string, commentId: string): Promise<ResultType> {

		const user = await this.usersRepository.findUserById(userId)
		const comment = await this.commentsRepository.getCommentById(commentId)

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
		const result = await this.commentsRepository.deleteComment(commentId)

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