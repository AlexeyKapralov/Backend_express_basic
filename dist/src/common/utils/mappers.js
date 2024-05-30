"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryParams = void 0;
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
