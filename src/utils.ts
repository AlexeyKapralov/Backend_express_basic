export const getQueryWithDefault = (query: {
	[key: string]: string | undefined
}) => {
	return {
		searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
		sortBy: query.sortBy ? query.sortBy : 'createdAt',
		sortDirection: query.sortDirection ? query.sortDirection : 'desc',
		pageNumber: query.pageNumber ? +query.pageNumber : 1,
		pageSize: query.pageSize !== undefined ? +query.pageSize : 10
	}
}

export type QueryType = {
	searchNameTerm: string | null
	sortBy: string
	sortDirection: string
	pageNumber: number
	pageSize: number
}
