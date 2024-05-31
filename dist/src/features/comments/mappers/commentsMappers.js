"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentView = void 0;
const getCommentView = (comment) => {
    return {
        id: comment._id,
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    };
};
exports.getCommentView = getCommentView;
