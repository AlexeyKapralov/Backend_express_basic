export const getQueryWithDefault = (query: {[key: string]: string | undefined}) => {
    return {
        searchNameTerm: query.searchNameTerm ? +query.searchNameTerm : null,
        sortBy: query.sortBy? query.sortBy : 'CreatedAt',
        sortDirection: query.sortDirection? query.sortDirection : 'desc',
        pageNumber: query.page ? +query.page : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10
    }
}