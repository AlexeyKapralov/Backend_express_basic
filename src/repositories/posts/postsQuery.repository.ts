import {IPostQueryModel} from "../../features/posts/models/postInput.model";
import {SortDirection} from "mongodb";
import {db} from "../../db/db";
import {getPostViewModel} from "../../common/utils/mappers";
import {IPaginatorPostViewModel, IPostViewModel} from "../../features/posts/models/postView.model";
import {IPostDbModel} from "../../features/posts/models/postDb.model";

export const postsQueryRepository = {
    async getPosts(query: IPostQueryModel): Promise<IPaginatorPostViewModel | undefined> {
        const posts = await db.getCollection().postsCollection
            .find()
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .sort(query.sortBy, query.sortDirection as SortDirection)
            .toArray()

        const countDocs = await db.getCollection().postsCollection.countDocuments()

        if (posts.length > 0) {
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: posts.map(getPostViewModel)
            }
        } else return undefined

    },
    async getPostById(id:string):Promise<IPostViewModel | undefined>{
        //TODO: as мы используем для того, чтобы указать какой тип мы получаем в результате?
        const result = await db.getCollection().postsCollection.findOne({
            _id: id
        }) as IPostDbModel
        return result ? getPostViewModel(result) : undefined
    }
}