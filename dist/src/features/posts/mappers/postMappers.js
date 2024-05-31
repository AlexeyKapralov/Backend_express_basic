"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostViewModel = void 0;
const getPostViewModel = (data) => {
    return {
        id: data._id,
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId,
        blogName: data.blogName,
        createdAt: data.createdAt,
    };
};
exports.getPostViewModel = getPostViewModel;
