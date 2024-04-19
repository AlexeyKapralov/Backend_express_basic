export type blogViewModelType = {
	id: string
	name: string
	description: string
	websiteUrl: string
	createdAt: string
	isMembership: boolean
}
export type paginatorBlogViewModelType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: blogViewModelType[]
}
