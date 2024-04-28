export interface IBlogInputModel {
    name: string
    description: string
    websiteUrl:	string
}

export interface IBlogPostInputModel {
    title: string
    shortDescription: string
    content: string
}

export interface IBlogQueryModel {
    searchNameTerm: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}
