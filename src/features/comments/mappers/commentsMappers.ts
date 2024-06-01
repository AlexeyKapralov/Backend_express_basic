import {ICommentDbModel} from "../models/commentDb.model";
import {ICommentViewModel} from "../models/commentView.model";

export const getCommentView = (comment :ICommentDbModel): ICommentViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}