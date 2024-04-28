export interface IBlogViewModel {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export interface IPaginatorBlogViewModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<IBlogViewModel>
}