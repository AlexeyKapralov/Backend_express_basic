import {ICommentDbModel} from "../models/commentDb.model";
import {ICommentViewModel} from "../models/commentView.model";

export const getCommentView = (comment :ICommentDbModel): ICommentViewModel => {
    return {
        id: comment._id,
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    }
}