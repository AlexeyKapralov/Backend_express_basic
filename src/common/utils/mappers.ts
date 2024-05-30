import {IQueryModel} from '../types/query.model'

export const getQueryParams = (query: IQueryModel): IQueryModel => {
    return {
        searchEmailTerm: query.searchEmailTerm!,
        searchNameTerm: query.searchNameTerm!,
        searchLoginTerm: query.searchLoginTerm!,
        sortBy: query.sortBy!,
        sortDirection: query.sortDirection!,
        pageNumber: +query.pageNumber!,
        pageSize: +query.pageSize!
    }
}
