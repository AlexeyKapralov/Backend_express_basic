export interface IUserInputModel {
    login: string
    password: string
    email: string
}

export interface IUserQueryModel {
    sortBy: string
    sortDirection: string
    pageNumber: number
    pageSize: number
    searchLoginTerm: string
    searchEmailTerm: string
}

export interface IQueryModel {
    searchEmailTerm?: string
    searchLoginTerm?: string
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: string
    pageNumber?: number
    pageSize?: number
}