"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicesRepository = void 0;
const db_1 = require("../../db/db");
exports.devicesRepository = {
    findDeviceId(userId, ip, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield db_1.db.getCollection().devices.findOne({ userId, ip, deviceName });
            return device ? device.deviceId : null;
        });
    },
    findDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceDb = yield db_1.db.getCollection().devices.aggregate([
                { $match: {
                        userId: device.userId,
                        ip: device.ip,
                        deviceId: device.deviceId,
                        deviceName: device.deviceName,
                        iat: device.iat,
                        expirationDate: device.expirationDate
                    }
                },
                { $project: { _ip: 0 } }
            ]).toArray();
            return deviceDb[0];
        });
    },
    findDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield db_1.db.getCollection().devices.findOne({ deviceId });
            return device ? device : null;
        });
    },
    createOrUpdateDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundDeviceId = yield this.findDeviceId(device.userId, device.ip, device.deviceName);
            if (foundDeviceId) {
                const isUpdatedDevice = yield db_1.db.getCollection().devices.updateOne({ userId: device.userId, ip: device.ip, deviceName: device.deviceName, deviceId: foundDeviceId }, { $set: { iat: device.iat, expirationDate: device.expirationDate } });
                return isUpdatedDevice.modifiedCount > 0;
            }
            else {
                const isCreatedDevice = yield db_1.db.getCollection().devices.insertOne(device);
                return isCreatedDevice.acknowledged;
            }
        });
    },
    deleteDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollection().devices.deleteOne({ deviceId: deviceId });
            return result.deletedCount > 0;
        });
    },
    deleteAllAnotherDevices(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield db_1.db.getCollection().devices.deleteMany({
                userId: device.userId,
                deviceId: { $ne: device.deviceId }
            });
            return isDeleted.acknowledged;
        });
    }
};
