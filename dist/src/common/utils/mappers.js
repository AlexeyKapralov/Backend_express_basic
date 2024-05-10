"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentView = exports.getUserInfo = exports.getQueryParams = exports.getPostViewModel = exports.getBlogViewModel = exports.getUserViewModel = void 0;
const getUserViewModel = (data) => {
    return {
        id: data._id,
        login: data.login,
        email: data.email,
        createdAt: data.createdAt,
    };
};
exports.getUserViewModel = getUserViewModel;
const getBlogViewModel = (data) => {
    return {
        id: data._id,
        name: data.name,
        description: data.description,
        websiteUrl: data.websiteUrl,
        createdAt: data.createdAt,
        isMembership: data.isMembership
    };
};
exports.getBlogViewModel = getBlogViewModel;
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
const getQueryParams = (query) => {
    return {
        searchEmailTerm: query.searchEmailTerm,
        searchNameTerm: query.searchNameTerm,
        searchLoginTerm: query.searchLoginTerm,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize
    };
};
exports.getQueryParams = getQueryParams;
const getUserInfo = (user) => {
    return {
        userId: user.id,
        email: user.email,
        login: user.login
    };
};
exports.getUserInfo = getUserInfo;
const getCommentView = (comment) => {
    return {
        id: comment._id,
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    };
};
exports.getCommentView = getCommentView;