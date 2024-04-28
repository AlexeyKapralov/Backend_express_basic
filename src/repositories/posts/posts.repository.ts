import {IPostInputModel} from "../../features/posts/models/postInput.model";
import {ObjectId} from "mongodb";
import {IPostDbModel} from "../../features/posts/models/postDb.model";
import {blogsQueryRepository} from "../blogs/blogsQuery.repository";
import {db} from "../../db/db";
import {getPostViewModel} from "../../common/utils/mappers";
import {IPostViewModel} from "../../features/posts/models/postView.model";

export const postsRepository = {
    async createPost(body: IPostInputModel): Promise<IPostViewModel | undefined> {
        const foundBlog = await blogsQueryRepository.getBlogByID(body.blogId)

        if (foundBlog) {
            const newPost: IPostDbModel = {
                _id: new ObjectId().toString(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: foundBlog.name,
                createdAt: new Date().toISOString()
            }
            const result = await db.getCollection().postsCollection.insertOne(newPost)
            return result.acknowledged ? getPostViewModel(newPost) : undefined
        }


    },
    async updatePost(id: string, body: IPostInputModel): Promise<boolean> {

        const foundBlog = await blogsQueryRepository.getBlogByID(body.blogId)

        const result = await db.getCollection().postsCollection.updateOne({
            _id: id
        }, {
            $set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: foundBlog!.name
            }
        })
        return result.acknowledged
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await db.getCollection().postsCollection.deleteOne({_id: id})
        return result.deletedCount > 0
    }
}