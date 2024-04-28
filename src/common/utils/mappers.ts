import { IUserDbModel } from '../../features/users/models/userDb.model'
import {IUserViewModel} from '../../features/users/models/userView.model'
import {IBlogDbModel} from "../../features/blogs/models/blogDb.model";
import {IBlogViewModel} from "../../features/blogs/models/blogView.model";
import {IBlogQueryModel} from "../../features/blogs/models/blogInput.model";
import {IUserQueryModel} from "../../features/users/models/userInput.model";
import {IPostDbModel} from "../../features/posts/models/postDb.model";
import {IPostViewModel} from "../../features/posts/models/postView.model";
import {IPostQueryModel} from "../../features/posts/models/postInput.model";

export const getUserViewModel = (data: IUserDbModel): IUserViewModel => {
	return {
		id: data._id,
		login: data.login,
		email: data.email,
		createdAt: data.createdAt,
	}
}

export const getBlogViewModel = (data: IBlogDbModel): IBlogViewModel => {
	return {
		id: data._id,
		name: data.name,
		description: data.description,
		websiteUrl:	data.websiteUrl,
		createdAt: data.createdAt,
		isMembership: data.isMembership
	}
}

export const getPostViewModel = (data: IPostDbModel): IPostViewModel => {
	return {
		id: data._id,
		title: data.title,
		shortDescription: data.shortDescription,
		content: data.content,
		blogId: data.blogId,
		blogName: data.blogName,
		createdAt: data.createdAt,
	}
}

//TODO: как и стоит ли объединять эти две функции в одну?
export const getQueryForUsers = (query: {
	[key: string]: string | undefined
}):IUserQueryModel => {
	return {
		searchEmailTerm: query.searchEmailTerm!,
		searchLoginTerm: query.searchLoginTerm!,
		sortBy: query.sortBy!,
		sortDirection: query.sortDirection!,
		pageNumber: +query.pageNumber!,
		pageSize: +query.pageSize!
	}
}

export const getQueryForBlogs = (query: {
	[key: string]: string | undefined
}): IBlogQueryModel => {
	return {
		searchNameTerm: query.searchNameTerm!,
		sortBy: query.sortBy!,
		sortDirection: query.sortDirection!,
		pageNumber: +query.pageNumber!,
		pageSize: +query.pageSize!
	}
}

export const getQueryForPosts = (query: {
	[key: string]: string | undefined
}): IPostQueryModel => {
	return {
		sortBy: query.sortBy!,
		sortDirection: query.sortDirection!,
		pageNumber: +query.pageNumber!,
		pageSize: +query.pageSize!
	}
}