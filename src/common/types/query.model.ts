
//сделан так, потому что в запросе к mongo там для sort direction можно только 1 или -1
//todo проверить чтобы только в контроллере использовался
export interface IQueryInputModel {
    searchEmailTerm?: string
    searchLoginTerm?: string
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: string
    pageNumber?: number
    pageSize?: number
}


export enum SortDirection {
    ascending = 1,
    descending = -1,
}

//todo проверить чтобы использовался везде кроме в контроллере
export interface IQueryOutputModel {
    searchEmailTerm?: string
    searchLoginTerm?: string
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: SortDirection
    pageNumber?: number
    pageSize?: number
}