import mongoose from "mongoose";
import {WithId} from "mongodb";
import {IPostDbModel} from "../models/postDb.model";

const PostSchema = new mongoose.Schema<WithId<IPostDbModel>>({
    _id: {type: String, require: true, unique: true},
    title: {type: String, require: true},
    shortDescription: { type: String, require: true },
    content: {type: String, require: true},
    blogId: {type: String, require: true},
    blogName:  {type: String, require: true},
    createdAt:  {type: String, require: true, match:  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/ }
})
export const PostModel = mongoose.model<IPostDbModel>('posts', PostSchema)