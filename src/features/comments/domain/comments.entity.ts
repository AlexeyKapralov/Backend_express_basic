import mongoose from "mongoose";
import {ICommentDbModel, ILikeDbModel} from "../models/commentDb.model";
import {ICommentatorInfo} from "../models/commentatorInfo.model";

const CommentatorInfo = new mongoose.Schema<ICommentatorInfo>({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}
})

const LikesSchema = new mongoose.Schema<ILikeDbModel>({
    createdAt: {type: Date, required: true},
    status: {type: String, required: true},
    userId: {type: String, required: true},
})

const CommentsSchema = new mongoose.Schema<ICommentDbModel>({
    _id: {type: String, required: true},
    content: {type: String, required: true},
    createdAt: {
        type: String,
        required: true,
        match: /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
    },
    postId: {type: String, required: true},
    commentatorInfo: CommentatorInfo,
    likes: [LikesSchema],
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
})

export const CommentsModel = mongoose.model<ICommentDbModel>('comments', CommentsSchema)