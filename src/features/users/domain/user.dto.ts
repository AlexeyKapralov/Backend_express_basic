//todo переписать с использование WithID
import mongoose, {Schema} from "mongoose";
import {WithId} from "mongodb";
import {IUserDbModel} from "../models/userDb.model";

export const UserSchema = new mongoose.Schema<WithId<IUserDbModel>>({
    _id: { type: String, require: true },
    login: { type: String, require: true },
    email: { type: String, require: true },
    createdAt: { type: String, require: true },
    password: { type: String, require: true },
    confirmationCode: { type: String, require: true },
    confirmationCodeExpired: { type: Date, require: true },
    isConfirmed: { type: Boolean, require: true }
})
export const UsersModel = mongoose.model<IUserDbModel>('users', UserSchema)