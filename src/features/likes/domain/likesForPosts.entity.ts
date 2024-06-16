import mongoose, {HydratedDocument, Model, Schema} from "mongoose";
import {ObjectId, WithId} from "mongodb";
import {IPostDbModel} from "../../posts/models/postDb.model";
import {ILikeCommentsDbModel, ILikePostsDbModel, LikeStatus} from "../models/like.type";

interface ILikePostsMethods {
    setDescription(likeStatus: LikeStatus): Promise<void>
}

interface ILikePostsModel extends Model<ILikePostsDbModel, {}, ILikePostsMethods> {
    initLikePost(likeStatus: LikeStatus, userId: string, postId: string, login: string): Promise<HydratedDocument<ILikePostsDbModel, ILikePostsMethods>>;
}

const LikesPostsSchema = new Schema<WithId<ILikePostsDbModel>, ILikePostsModel, ILikePostsMethods>({
    userId: {type: String, required: true},
    addedAt: {type: Date, required: true},
    login: {type: String, required: true},
    description: {type: String, required: true},
    postId: {type: String, required: true}
})

LikesPostsSchema.static('initLikePost', async function initLikePost(statusLike: LikeStatus, userId: string, postId: string, login: string) {
    const like = {
        userId: userId,
        addedAt: new Date(),
        login: login,
        description: statusLike || 'None',
        postId: postId
    }
    return await this.create(like)
})
LikesPostsSchema.method('setDescription', async function setDescription(likeStatus: LikeStatus) {
    this.description = likeStatus
    await this.save()
})

export const LikesPostsModel = mongoose.model<WithId<ILikePostsDbModel>, ILikePostsModel>('likesPosts', LikesPostsSchema)