"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryForPosts = exports.getQueryForBlogs = exports.getQueryForUsers = exports.getPostViewModel = exports.getBlogViewModel = exports.getUserViewModel = void 0;
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
//TODO: как и стоит ли объединять эти две функции в одну?
const getQueryForUsers = (query) => {
    return {
        searchEmailTerm: query.searchEmailTerm,
        searchLoginTerm: query.searchLoginTerm,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize
    };
};
exports.getQueryForUsers = getQueryForUsers;
const getQueryForBlogs = (query) => {
    return {
        searchNameTerm: query.searchNameTerm,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize
    };
};
exports.getQueryForBlogs = getQueryForBlogs;
const getQueryForPosts = (query) => {
    return {
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize
    };
};
exports.getQueryForPosts = getQueryForPosts;
