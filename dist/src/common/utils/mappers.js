"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryParams = void 0;
const query_model_1 = require("../types/query.model");
const getQueryParams = (query) => {
    let sortD = query_model_1.SortDirection.descending;
    if (query.sortDirection === 'asc' || Number(query.sortDirection) === 1 || query.sortDirection === 'ascending') {
        sortD = query_model_1.SortDirection.ascending;
    }
    return {
        searchEmailTerm: query.searchEmailTerm,
        searchNameTerm: query.searchNameTerm,
        searchLoginTerm: query.searchLoginTerm,
        sortBy: query.sortBy,
        sortDirection: sortD,
        pageNumber: +query.pageNumber,
        pageSize: +query.pageSize
    };
};
exports.getQueryParams = getQueryParams;
