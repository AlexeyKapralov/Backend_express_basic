export type postViewModelType = {
	id: string
	title: string
	shortDescription: string
	content: string
	blogId: string
	blogName: string
	createdAt: string
}
export type paginatorPostsViewModelType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: postViewModelType[]
}
