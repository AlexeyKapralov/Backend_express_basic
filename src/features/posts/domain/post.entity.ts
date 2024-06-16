import mongoose, {Model} from "mongoose";
import {WithId} from "mongodb";
import {IPostDbModel} from "../models/postDb.model";


interface IPostsMethods {
    addCountLikes(count: number): Promise<void>,
    addCountDislikes(count: number): Promise<void>
}

interface IPostModel extends Model<IPostDbModel, {}, IPostsMethods> {
    // initPost(body: IPostInputModel): Promise<HydratedDocument<IPostDbModel, IPostsMethods>>
    // getPostByID(id: string): HydratedDocument<IPostDbModel>
}

const PostSchema = new mongoose.Schema<WithId<IPostDbModel>, IPostModel, IPostsMethods>({
    title: {type: String, required: true},
    shortDescription: { type: String, required: true },
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName:  {type: String, required: true},
    createdAt:  {type: String, required: true, match:  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/ },
    dislikesCount: {type: Number, required: true},
    likesCount: {type: Number, required: true}
})

// BlogSchema.static('getBlogByID', function getBlogByID(id: string) {
//     return this.findOne({
//         _id: id
//     });
// })
PostSchema.method('addCountLikes', async function addCountLikes(count: number) {
    this.likesCount = this.likesCount + count
    await this.save()
})
PostSchema.method('addCountDislikes', async function addCountDislikes(count: number) {
    this.dislikesCount = this.dislikesCount + count
    await this.save()
})

export const PostModel = mongoose.model<WithId<IPostDbModel>, IPostModel>('posts', PostSchema)