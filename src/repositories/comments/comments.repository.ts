import { ICommentDbModel } from '../../features/comments/models/commentDb.model'
import { ICommentInputModel } from '../../features/comments/models/commentInput.model'
import { ObjectId } from 'mongodb'
import { IUserViewModel } from '../../features/users/models/userView.model'
import { IPostViewModel } from '../../features/posts/models/postView.model'
import { db } from '../../db/db'

export const commentsRepository = {
	async createComment(user: IUserViewModel, post: IPostViewModel, data: ICommentInputModel): Promise<ICommentDbModel | undefined> {
		const newComment = {
			_id: new ObjectId().toString(),
			content: data.content,
			commentatorInfo: {
				userId: user.id,
				userLogin: user.login
			},
			createdAt: new Date().toISOString(),
			postId: post.id
		}

		const result = await db.getCollection().commentsCollection.insertOne(newComment)
		return result.acknowledged ? newComment : undefined
	},
	async updateComment(commentId:string, data: ICommentInputModel): Promise<boolean> {
		const isUpdatedComment = await db.getCollection().commentsCollection
			.updateOne(
				{_id: commentId},
				{$set: {
						content: data.content
					}}
				)

		return isUpdatedComment.modifiedCount > 0
	},
	async deleteComment(commentId:string) {
		const isDeleted = await db.getCollection().commentsCollection.deleteOne({_id: commentId})
		return isDeleted.deletedCount > 0
	}
}