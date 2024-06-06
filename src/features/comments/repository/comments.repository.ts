import {ICommentDbModel} from '../models/commentDb.model'
import {ICommentInputModel} from '../models/commentInput.model'
import {ObjectId, WithId} from 'mongodb'
import {IPostDbModel} from "../../posts/models/postDb.model";
import {CommentsModel} from "../domain/comments.entity";
import {IUserDbModel} from "../../users/models/userDb.model";

export class CommentsRepository {

    async getCommentById(id: string): Promise<ICommentDbModel | undefined> {
        const result = await CommentsModel.findOne({_id: id})
        return result ? result : undefined
    }

    async createComment(user: IUserDbModel, post: WithId<IPostDbModel>, data: ICommentInputModel): Promise<ICommentDbModel | undefined> {
        const newComment = {
            _id: new ObjectId().toString(),
            content: data.content,
            commentatorInfo: {
                userId: user._id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: post._id.toString()
        }

        const result = await CommentsModel.create(newComment)

        return !!result ? newComment : undefined
    }

    async updateComment(commentId: string, data: ICommentInputModel): Promise<boolean> {
        const isUpdatedComment = await CommentsModel
            .updateOne(
                {_id: commentId},
                {
                    $set: {
                        content: data.content
                    }
                }
            )

        return isUpdatedComment.modifiedCount > 0
    }

    async deleteComment(commentId: string) {
        const isDeleted = await CommentsModel.deleteOne({_id: commentId})
        return isDeleted.deletedCount > 0
    }
}