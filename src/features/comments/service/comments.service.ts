import {ICommentViewModel} from '../models/commentView.model'
import {ResultType} from '../../../common/types/result.type'
import {ResultStatus} from '../../../common/types/resultStatus.type'
import {ICommentInputModel} from '../models/commentInput.model'
import {UsersRepository} from "../../users/repository/users.repository";
import {CommentsRepository} from "../repository/comments.repository";
import {ILikeDbModel, LikeStatus} from "../models/commentDb.model";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
	constructor(@inject(UsersRepository) protected usersRepository: UsersRepository, @inject(CommentsRepository) protected commentsRepository: CommentsRepository) {
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

	async updateLikeStatus(commentId: string, likeData: ILikeDbModel) {

		const comment = await this.commentsRepository.getCommentById(commentId)

		if (!comment) {
			return {
				status: ResultStatus.NotFound,
					data: null
			}
		}
		const status = comment.likes.filter(i=> i.userId === likeData.userId)
		let currentStatus
		if (status.length === 0) {
			currentStatus = LikeStatus.None
		} else {
			currentStatus = status[0].status
		}

		const newStatus = likeData.status
		let likeIterator = 0
		let dislikeIterator = 0


		if (currentStatus === newStatus) {
			likeIterator = 0
			dislikeIterator = 0
		}
		if (currentStatus === LikeStatus.Like && newStatus === LikeStatus.Dislike) {
			likeIterator = -1
			dislikeIterator = 1
		}
		if (currentStatus === LikeStatus.Dislike && newStatus === LikeStatus.Like) {
			likeIterator = 1
			dislikeIterator = -1
		}
		if (currentStatus === LikeStatus.None && newStatus === LikeStatus.Like) {
			likeIterator = 1
			dislikeIterator = 0
		}
		if (currentStatus === LikeStatus.Like && newStatus === LikeStatus.None) {
			likeIterator = -1
			dislikeIterator = 0
		}
		if (currentStatus === LikeStatus.Dislike && newStatus === LikeStatus.None) {
			likeIterator = 0
			dislikeIterator = -1
		}
		if (currentStatus === LikeStatus.None && newStatus === LikeStatus.Dislike) {
			likeIterator = 0
			dislikeIterator = 1
		}

		const isUpdatedLikeStatus: boolean = await this.commentsRepository.updateLikeStatus(comment?._id || '', likeData, likeIterator, dislikeIterator)

		return isUpdatedLikeStatus
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