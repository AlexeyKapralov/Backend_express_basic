import mongoose from "mongoose";
import {WithId} from "mongodb";

const RateLimitsSchema = new mongoose.Schema<WithId<IRateLimitModel>>({
    date: {type: Date, required: true},
    url: {type: String, required: true},
    ip: {type: String, required: true}
})

export const RateLimitModel = mongoose.model<WithId<IRateLimitModel>>('rateLimit', RateLimitsSchema)