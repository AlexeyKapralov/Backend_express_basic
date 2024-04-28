export interface IPostInputModel{
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export interface IPostQueryModel {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}