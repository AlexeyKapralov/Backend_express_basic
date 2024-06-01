import mongoose from "mongoose";
import {WithId} from "mongodb";
import {IBlogDbModel} from "../models/blogDb.model";

export const BlogSchema = new mongoose.Schema<WithId<IBlogDbModel>>({
    _id: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true, match: /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/ }
})
export const BlogModel = mongoose.model<IBlogDbModel>('blogs', BlogSchema)