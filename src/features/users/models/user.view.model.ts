export interface IUserViewModel {
	id: string
	login: string
	email: string
	createdAt: string
	password: string
}

export interface IQueryUserModel {
	sortBy: string
	sortDirection: string
	pageNumber: number
	pageSize: number
	searchLoginTerm: string
	searchEmailTerm: string
}

export interface IPaginatorUserViewModel {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: Array<IUserViewModel>
}
