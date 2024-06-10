import {ICommentDbModel, LikeStatus} from "../models/commentDb.model";
import {ICommentViewModel} from "../models/commentView.model";

export const getCommentView = (comment :ICommentDbModel, userId: string = 'default'): ICommentViewModel => {

    let currentStatusArray: any = []

    if (comment.likes.length > 0 && userId !== 'default') {
        currentStatusArray = comment.likes.filter(i => i.userId === userId)
    }

    let currentStatus = LikeStatus.None
    if (currentStatusArray.length > 0) {
        currentStatus = currentStatusArray[0].status
    }

    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesCount,
            dislikesCount: comment.dislikesCount,
            myStatus: currentStatus
        }
    }
}