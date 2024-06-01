"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentView = void 0;
const getCommentView = (comment) => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    };
};
exports.getCommentView = getCommentView;
