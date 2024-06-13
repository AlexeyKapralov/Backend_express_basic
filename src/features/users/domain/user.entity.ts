import mongoose from "mongoose";
import {WithId} from "mongodb";
import {IUserDbModel} from "../models/userDb.model";

export const UserSchema = new mongoose.Schema<WithId<IUserDbModel>>({
    _id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    password: { type: String, required: true },
    confirmationCode: { type: String, required: true },
    confirmationCodeExpired: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true }
})
export const UsersModel = mongoose.model<IUserDbModel>('users', UserSchema)