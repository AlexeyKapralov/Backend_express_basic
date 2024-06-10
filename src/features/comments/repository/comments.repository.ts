import {ICommentDbModel, ILikeDbModel} from '../models/commentDb.model'
import {ICommentInputModel} from '../models/commentInput.model'
import {ObjectId, WithId} from 'mongodb'
import {IPostDbModel} from "../../posts/models/postDb.model";
import {CommentsModel} from "../domain/comments.entity";
import {IUserDbModel} from "../../users/models/userDb.model";

export class CommentsRepository {

    // async getCommentById(id: string): Promise<ICommentDbModel | undefined> {
    //     const result = await CommentsModel.aggregate([
    //         {
    //             $match: {_id: id}
    //         },
    //         {
    //             $unwind: '$likes'
    //         },
    //         {
    //             $match: {
    //                 "likes.userId": id
    //             }
    //         }
    //     ]).exec()

    async getCommentById(id: string): Promise<ICommentDbModel | undefined> {
        const result = await CommentsModel.findOne({
            _id: id
        })
        return result ? result : undefined
    }

    async createComment(user: IUserDbModel, post: WithId<IPostDbModel>, data: ICommentInputModel): Promise<ICommentDbModel | undefined> {
        const newComment: ICommentDbModel = {
            _id: new ObjectId().toString(),
            content: data.content,
            commentatorInfo: {
                userId: user._id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: post._id.toString(),
            likes: [],
            dislikesCount: 0,
            likesCount: 0
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

    async updateLikeStatus(commentId: string, likeData: ILikeDbModel, likeIterator: number, dislikeIterator: number): Promise<boolean> {

        const isExist = await CommentsModel.find(
            {
                _id: commentId,
                // likes: {
                //     $elemMatch: {
                //         userId: likeData.userId
                //     }
                // }
                'likes.userId': likeData.userId
            }
        ).exec()

        let isUpdated
        if (isExist.length > 0) {
            isUpdated = await CommentsModel.updateOne(
                {_id: commentId, 'likes.userId': likeData.userId},
                {
                    $inc: {
                        likesCount: likeIterator,
                        dislikesCount: dislikeIterator
                    },
                    $set: {
                        'likes.$.createdAt': likeData.createdAt,
                        'likes.$.status': likeData.status
                    }
                }
            )

            return isUpdated.modifiedCount > 0
        }

        isUpdated = await CommentsModel.updateOne(
            {_id: commentId},
            {
                $inc: {
                    likesCount: likeIterator,
                    dislikesCount: dislikeIterator
                },
                $push: {likes: likeData}
            }
        )

        return isUpdated.modifiedCount > 0
    }
}