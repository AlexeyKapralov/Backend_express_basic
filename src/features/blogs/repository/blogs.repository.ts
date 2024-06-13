import {IBlogDbModel} from "../models/blogDb.model";
import {IBlogInputModel} from "../models/blogInput.model";
import {BlogModel} from "../domain/blogs.entity";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {

    async createBlog(body: IBlogDbModel) {
        const result = await BlogModel.create(body)
        return !!result
    }
    async updateBlogByID(id: string, body: IBlogInputModel): Promise<boolean> {
        const result = await BlogModel.updateOne({
            _id: id
        }, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        })
        return result.modifiedCount > 0
    }
    async deleteBlogByID(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id: id})
        return result.deletedCount > 0
    }
    async getBlogByID(id: string) {
        const result = await BlogModel.findOne({
            _id: id
        })
        return result ? result : undefined
    }
}