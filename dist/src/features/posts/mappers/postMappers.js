"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostViewModel = void 0;
const getPostViewModel = (data, newestlikes, status) => {
    return {
        id: data._id.toString(),
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId,
        blogName: data.blogName,
        createdAt: data.createdAt,
        extendedLikesInfo: {
            likesCount: data.likesCount,
            dislikesCount: data.dislikesCount,
            newestLikes: newestlikes,
            myStatus: status
        }
    };
};
exports.getPostViewModel = getPostViewModel;
