import {db} from "../../db/db";
import {IBlogQueryModel} from "../../features/blogs/models/blogInput.model";
import {SortDirection} from "mongodb";
import {getBlogViewModel, getPostViewModel} from "../../common/utils/mappers";
import {IPaginatorBlogViewModel} from "../../features/blogs/models/blogView.model";
import {IBlogDbModel} from "../../features/blogs/models/blogDb.model";
import {IPaginatorPostViewModel} from "../../features/posts/models/postView.model";
import {IPostQueryModel} from "../../features/posts/models/postInput.model";

export const blogsQueryRepository = {
    async getBlogs(query: IBlogQueryModel): Promise<IPaginatorBlogViewModel | undefined> {

        // TODO: так правильно делать?
        let conditions
        if (query.searchNameTerm) {
            conditions =
                {name: {$regex: query.searchNameTerm, $options: 'i'}}
        }
        let newQuery = {}
        if (conditions) {
            newQuery = conditions
        }

        const res = await db.getCollection().blogsCollection
            .find(newQuery)
            .sort(query.sortBy, query.sortDirection as SortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const countDocs = await db.getCollection().blogsCollection
            .countDocuments(newQuery)

        if (res.length > 0) {
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: res.map(getBlogViewModel)
            }
        } else {
            return undefined
        }
    },

    async getBlogByID(id: string) {
        //TODO: правильно ли здесь использовать as, ведь я не могу указать тип сразу (const result: IBlogDbModel),
        // т.к. это promise
        const result = await db.getCollection().blogsCollection.findOne({
            _id: id
        }) as IBlogDbModel
        return result ? getBlogViewModel(result) : undefined
    },

    async getPostsByBlogID(id: string, query: IPostQueryModel): Promise<IPaginatorPostViewModel | undefined> {

        const res = await db.getCollection().postsCollection
            .find({blogId: id})
            .sort(query.sortBy, query.sortDirection as SortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const countDocs = await db.getCollection().postsCollection
            .countDocuments({blogId: id})

        if (res.length > 0) {
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: res.map(getPostViewModel)
            }
        } else {
            return undefined
        }
    }
}