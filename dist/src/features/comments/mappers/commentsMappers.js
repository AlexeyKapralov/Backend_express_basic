"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentView = void 0;
const commentDb_model_1 = require("../models/commentDb.model");
const getCommentView = (comment, userId = 'default') => {
    let currentStatusArray = [];
    if (comment.likes.length > 0 && userId !== 'default') {
        currentStatusArray = comment.likes.filter(i => i.userId === userId);
    }
    let currentStatus = commentDb_model_1.LikeStatus.None;
    if (currentStatusArray.length > 0) {
        currentStatus = currentStatusArray[0].status;
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
    };
};
exports.getCommentView = getCommentView;
