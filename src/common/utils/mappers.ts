import {IUserDbModel} from '../../features/users/models/userDb.model'
import {IUserViewModel} from '../../features/users/models/userView.model'
import {IBlogDbModel} from "../../features/blogs/models/blogDb.model";
import {IBlogViewModel} from "../../features/blogs/models/blogView.model";
import {IQueryModel} from "../../features/users/models/userInput.model";
import {IPostDbModel} from "../../features/posts/models/postDb.model";
import {IPostViewModel} from "../../features/posts/models/postView.model";

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
        websiteUrl: data.websiteUrl,
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

export const getQueryParams = (query: IQueryModel): IQueryModel => {
    return {
        searchEmailTerm: query.searchEmailTerm,
        searchLoginTerm: query.searchLoginTerm!,
        sortBy: query.sortBy!,
        sortDirection: query.sortDirection!,
        pageNumber: +query.pageNumber!,
        pageSize: +query.pageSize!
    }
}