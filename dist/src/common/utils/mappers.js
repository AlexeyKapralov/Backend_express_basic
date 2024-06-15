"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryParams = void 0;
const query_model_1 = require("../types/query.model");
const getQueryParams = (query) => {
    return {
        searchEmailTerm: query.searchEmailTerm,
        searchNameTerm: query.searchNameTerm,
        searchLoginTerm: query.searchLoginTerm,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection == 'asc' ? query_model_1.SortDirection.ascending : query_model_1.SortDirection.descending,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize
    };
};
exports.getQueryParams = getQueryParams;
