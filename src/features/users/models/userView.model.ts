export interface IUserViewModel {
	id: string
	login: string
	email: string
	createdAt: string
}


export interface IPaginatorUserViewModel {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: Array<IUserViewModel>
}
