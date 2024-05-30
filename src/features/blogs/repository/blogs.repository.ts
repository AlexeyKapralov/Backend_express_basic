import {db} from "../../../db/db";
import {IBlogDbModel} from "../models/blogDb.model";
import {IBlogInputModel} from "../models/blogInput.model";

export const blogsRepository = {
    async createBlog(body: IBlogDbModel) {
        const result = await db.getCollection().blogsCollection.insertOne(body)
        return result.acknowledged
    },
    async updateBlogByID(id: string, body: IBlogInputModel): Promise<boolean> {
        const result = await db.getCollection().blogsCollection.updateOne({
            _id: id
        }, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        })
        return result.modifiedCount > 0
    },
    async deleteBlogByID(id: string): Promise<boolean> {
        const result = await db.getCollection().blogsCollection.deleteOne({_id: id})
        return result.deletedCount > 0
    },
    async getBlogByID(id: string) {
        const result = await db.getCollection().blogsCollection.findOne({
            _id: id
        })
        return result ? result : undefined
    },
}