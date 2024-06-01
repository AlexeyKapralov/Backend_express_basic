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
const devices_entity_1 = require("../domain/devices.entity");
exports.devicesRepository = {
    findDeviceId(userId, ip, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield devices_entity_1.DeviceModel.findOne({ userId, ip, deviceName });
            return device ? device.deviceId : null;
        });
    },
    findDevice(deviceId, userId, iat) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceDb = yield devices_entity_1.DeviceModel.aggregate([
                { $match: {
                        userId: userId,
                        deviceId: deviceId,
                        iat: String(iat)
                    }
                },
                { $project: { _id: 0 } }
            ]);
            return deviceDb[0];
        });
    },
    findDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield devices_entity_1.DeviceModel.findOne({ deviceId });
            return device ? device : null;
        });
    },
    createOrUpdateDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundDeviceId = yield this.findDeviceId(device.userId, device.ip, device.deviceName);
            if (foundDeviceId) {
                const isUpdatedDevice = yield devices_entity_1.DeviceModel.updateOne({ deviceId: foundDeviceId }, { $set: { iat: String(device.iat), exp: String(device.exp) } });
                return isUpdatedDevice.modifiedCount > 0;
            }
            else {
                const createdDevice = yield devices_entity_1.DeviceModel.create(device);
                return createdDevice;
            }
        });
    },
    deleteDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield devices_entity_1.DeviceModel.deleteOne({ deviceId: deviceId });
            return result.deletedCount > 0;
        });
    },
    deleteAllAnotherDevices(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield devices_entity_1.DeviceModel.deleteMany({
                userId: userId,
                deviceId: { $ne: deviceId }
            });
            return isDeleted.acknowledged;
        });
    }
};
