import mongoose from "mongoose";
import {WithId} from "mongodb";
import {IDeviceDbModel} from "../models/deviceDb.model";

export const DeviceSchema = new mongoose.Schema<WithId<IDeviceDbModel>>({
    userId: {type: String, required: true},
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    exp: { type: String, required: true },
    deviceName: { type: String, required: true },
    iat: { type: String, required: true }
})
export const DeviceModel = mongoose.model<WithId<IDeviceDbModel>>('devices', DeviceSchema)