import {IPostInputModel} from "../models/postInput.model";
import {ObjectId} from "mongodb";
import {IPostDbModel} from "../models/postDb.model";
import {db} from "../../../db/db";
import {IPostViewModel} from "../models/postView.model";
import {blogsRepository} from "../../blogs/repository/blogs.repository";
import {getPostViewModel} from "../mappers/postMappers";

export const postsRepository = {
    async getPostById(id: string): Promise<IPostDbModel | undefined> {
        const result = await db.getCollection().postsCollection.findOne({
            _id: id
        })
        return result ? result : undefined
    },
    async createPost(body: IPostInputModel, blogName: string): Promise<IPostViewModel | undefined> {

        const newPost: IPostDbModel = {
            _id: new ObjectId().toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName,
            createdAt: new Date().toISOString()
        }
        const result = await db.getCollection().postsCollection.insertOne(newPost)
        return result.acknowledged ? getPostViewModel(newPost) : undefined
    },
    async updatePost(id: string, body: IPostInputModel): Promise<boolean> {

        const foundBlog = await blogsRepository.getBlogByID(body.blogId)

        if (foundBlog) {

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

            return result.matchedCount > 0
        } else return false
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await db.getCollection().postsCollection.deleteOne({_id: id})
        return result.deletedCount > 0
    }
}