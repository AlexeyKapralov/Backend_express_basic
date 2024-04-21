"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryPostsWithDefault = exports.getQueryBlogsWithDefault = void 0;
const getQueryBlogsWithDefault = (query) => {
    return {
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection : 'desc',
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10
    };
};
exports.getQueryBlogsWithDefault = getQueryBlogsWithDefault;
const getQueryPostsWithDefault = (query) => {
    return {
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection : 'desc',
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10
    };
};
exports.getQueryPostsWithDefault = getQueryPostsWithDefault;
