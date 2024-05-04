import {db} from "../../db/db";
import {SortDirection} from "mongodb";
import {getBlogViewModel, getPostViewModel} from "../../common/utils/mappers";
import {IQueryModel} from "../../features/users/models/userInput.model";
import { IPaginator } from '../../common/types/paginator'
import { IBlogViewModel } from '../../features/blogs/models/blogView.model'
import { IPostViewModel } from '../../features/posts/models/postView.model'

export const blogsQueryRepository = {
    async getBlogs(query: IQueryModel): Promise<IPaginator<IBlogViewModel> | undefined> {

        const newQuery = {name: {$regex: query.searchNameTerm ?? '', $options: 'i'}}

        const res = await db.getCollection().blogsCollection
            .find(newQuery)
            .sort(query.sortBy!, query.sortDirection as SortDirection)
            .skip((query.pageNumber! - 1) * query.pageSize!)
            .limit(query.pageSize!)
            .toArray()

        const countDocs = await db.getCollection().blogsCollection
            .countDocuments(newQuery)

        if (res.length > 0) {
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize!),
                page: query.pageNumber!,
                pageSize: query.pageSize!,
                totalCount: countDocs,
                items: res.map(getBlogViewModel)
            }
        } else {
            return undefined
        }
    },

    async getBlogByID(id: string) {
        const result = await db.getCollection().blogsCollection.findOne({
            _id: id
        })
        return result ? getBlogViewModel(result) : undefined
    },

    async getPostsByBlogID(id: string, query: IQueryModel): Promise<IPaginator<IPostViewModel> | undefined> {

        const res = await db.getCollection().postsCollection
            .find({blogId: id})
            .sort(query.sortBy!, query.sortDirection as SortDirection)
            .skip((query.pageNumber! - 1) * query.pageSize!)
            .limit(query.pageSize!)
            .toArray()

        const countDocs = await db.getCollection().postsCollection
            .countDocuments({blogId: id})

        if (res.length > 0) {
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize!),
                page: query.pageNumber!,
                pageSize: query.pageSize!,
                totalCount: countDocs,
                items: res.map(getPostViewModel)
            }
        } else {
            return undefined
        }
    }
}