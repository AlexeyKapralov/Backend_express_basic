import { SortDirection } from 'mongodb'

export interface IQueryModel {
	searchEmailTerm?: string
	searchLoginTerm?: string
	searchNameTerm?: string
	sortBy?: string
	sortDirection?: SortDirection
	pageNumber?: number
	pageSize?: number
}