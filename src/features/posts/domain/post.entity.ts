import mongoose from "mongoose";
import {WithId} from "mongodb";
import {IPostDbModel} from "../models/postDb.model";

const PostSchema = new mongoose.Schema<WithId<IPostDbModel>>({
    _id: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    shortDescription: { type: String, required: true },
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName:  {type: String, required: true},
    createdAt:  {type: String, required: true, match:  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/ }
})
export const PostModel = mongoose.model<IPostDbModel>('posts', PostSchema)