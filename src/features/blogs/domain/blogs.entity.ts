import mongoose, {HydratedDocument, Model} from "mongoose";
import {IBlogDbModel} from "../models/blogDb.model";
import {IBlogInputModel} from "../models/blogInput.model";
import {ObjectId} from "mongodb";

interface BlogsMethods {

}

interface IBlogModel extends Model<IBlogDbModel, {}, BlogsMethods> {
    initUser(body: IBlogInputModel): Promise<HydratedDocument<IBlogDbModel, BlogsMethods>>
    getBlogByID(id: string): HydratedDocument<IBlogDbModel>
}

export const BlogSchema =
    new mongoose.Schema<IBlogDbModel, IBlogModel, BlogsMethods>({
        _id: {type: String, required: true},
        description: {type: String, required: true},
        name: {type: String, required: true},
        isMembership: {type: Boolean, required: true},
        websiteUrl: {type: String, required: true},
        createdAt: {
            type: String,
            required: true,
            match: /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
        }
    })

BlogSchema.static('getBlogByID', function getBlogByID(id: string) {
    return this.findOne({
        _id: id
    });
})

BlogSchema.static('initUser', async function initUser(body: IBlogInputModel) {
    const blog: IBlogDbModel = {
        _id: new ObjectId().toString(),
        name: body.name,
        description: body.description,
        websiteUrl: body.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false
    }

    return await this.create(blog)
})

export const BlogModel = mongoose.model<IBlogDbModel, IBlogModel, BlogsMethods>('blogs', BlogSchema)