import mongoose from "mongoose";
import {ObjectId, WithId} from "mongodb";
import {IDeviceDbModel} from "../models/deviceDb.model";

export const DeviceSchema = new mongoose.Schema<WithId<IDeviceDbModel>>({
    deviceId: { type: String, require: true },
    ip: { type: String, require: true },
    expirationDate: { type: String, require: true },
    deviceName: { type: String, require: true },
    iat: { type: String, require: true }
})
export const DeviceModel = mongoose.model<WithId<IDeviceDbModel>>('devices', DeviceSchema)