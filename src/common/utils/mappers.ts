import {IQueryInputModel, IQueryOutputModel, SortDirection} from '../types/query.model'

export const getQueryParams = (query: IQueryInputModel): IQueryOutputModel => {
    let sortD = SortDirection.descending
    if (query.sortDirection! === 'asc' || Number(query.sortDirection!) === 1 || query.sortDirection! === 'ascending') {
        sortD = SortDirection.ascending
    }
    return {
        searchEmailTerm: query.searchEmailTerm!,
        searchNameTerm: query.searchNameTerm!,
        searchLoginTerm: query.searchLoginTerm!,
        sortBy: query.sortBy!,
        sortDirection: sortD,
        pageNumber: +query.pageNumber!,
        pageSize: +query.pageSize!
    }
}
