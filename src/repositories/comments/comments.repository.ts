import {ICommentDbModel} from '../../features/comments/models/commentDb.model'
import {ICommentInputModel} from '../../features/comments/models/commentInput.model'
import {ObjectId} from 'mongodb'
import {db} from '../../db/db'
import {IPostDbModel} from "../../features/posts/models/postDb.model";
import {IUserDbModel} from "../../features/users/models/userDb.model";

export const commentsRepository = {
    async getCommentById(id: string): Promise<ICommentDbModel | undefined> {
        const result = await db.getCollection().commentsCollection.findOne({_id: id})
        return result ? result : undefined
    },
    async createComment(user: IUserDbModel, post: IPostDbModel, data: ICommentInputModel): Promise<ICommentDbModel | undefined> {
        const newComment = {
            _id: new ObjectId().toString(),
            content: data.content,
            commentatorInfo: {
                userId: user._id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: post._id
        }

        const result = await db.getCollection().commentsCollection.insertOne(newComment)
        return result.acknowledged ? newComment : undefined
    },
    async updateComment(commentId: string, data: ICommentInputModel): Promise<boolean> {
        const isUpdatedComment = await db.getCollection().commentsCollection
            .updateOne(
                {_id: commentId},
                {
                    $set: {
                        content: data.content
                    }
                }
            )

        return isUpdatedComment.modifiedCount > 0
    },
    async deleteComment(commentId: string) {
        const isDeleted = await db.getCollection().commentsCollection.deleteOne({_id: commentId})
        return isDeleted.deletedCount > 0
    }
}