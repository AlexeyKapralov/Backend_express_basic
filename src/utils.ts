export const getQueryBlogsWithDefault = (query: {
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

export type QueryBlogType = {
	searchNameTerm: string | null
	sortBy: string
	sortDirection: string
	pageNumber: number
	pageSize: number
}

export const getQueryPostsWithDefault = (query: {
	[key: string]: string | undefined
}) => {
	return {
		sortBy: query.sortBy ? query.sortBy : 'createdAt',
		sortDirection: query.sortDirection ? query.sortDirection : 'desc',
		pageNumber: query.pageNumber ? +query.pageNumber : 1,
		pageSize: query.pageSize !== undefined ? +query.pageSize : 10
	}
}

export type QueryPostsType = {
	sortBy: string
	sortDirection: string
	pageNumber: number
	pageSize: number
}
