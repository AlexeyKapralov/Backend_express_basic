"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceModel = exports.DeviceSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.DeviceSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    exp: { type: String, required: true },
    deviceName: { type: String, required: true },
    iat: { type: String, required: true }
});
exports.DeviceModel = mongoose_1.default.model('devices', exports.DeviceSchema);
