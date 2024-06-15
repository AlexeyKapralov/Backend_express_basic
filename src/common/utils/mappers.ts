import {IQueryInputModel, IQueryOutputModel, SortDirection} from '../types/query.model'

export const getQueryParams = (query: IQueryInputModel): IQueryOutputModel => {
    return {
        searchEmailTerm: query.searchEmailTerm!,
        searchNameTerm: query.searchNameTerm!,
        searchLoginTerm: query.searchLoginTerm!,
        sortBy: query.sortBy!,
        sortDirection: query.sortDirection! == 'asc' ? SortDirection.ascending : SortDirection.descending,
        pageNumber: +query.pageNumber!,
        pageSize: +query.pageSize!
    }
}
