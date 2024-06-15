import mongoose from "mongoose";
import {ObjectId, WithId} from "mongodb";
import {IPostDbModel} from "../../posts/models/postDb.model";
import {ILikeCommentsDbModel, ILikePostsDbModel} from "../models/like.type";


const LikesPostsSchema = new mongoose.Schema<WithId<ILikePostsDbModel>>({
    userId: {type: String, required: true},
    addedAt: {type: Date, required: true},
    login: {type: String, required: true},
    description: {type: String, required: true},
    postId: {type: String, required: true}
})
export const LikesPostsModel = mongoose.model<WithId<ILikePostsDbModel>>('likesPosts', LikesPostsSchema)