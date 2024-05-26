"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../config/settings");
exports.jwtService = {
    createAccessToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, settings_1.SETTINGS.SECRET_JWT, { expiresIn: "10s" });
    },
    createRefreshToken(device) {
        return jsonwebtoken_1.default.sign(device, settings_1.SETTINGS.SECRET_JWT, { expiresIn: "20s" });
    },
    getUserIdByToken(token) {
        try {
            const result = jsonwebtoken_1.default.verify(token, settings_1.SETTINGS.SECRET_JWT);
            return result.userId;
        }
        catch (e) {
            return null;
        }
    },
    //todo вопросики по корректности такого кода (как типизировать payload из JWT verify)
    getPayloadFromRefreshToken(token) {
        try {
            const result = jsonwebtoken_1.default.verify(token, settings_1.SETTINGS.SECRET_JWT);
            return {
                deviceId: result.deviceId,
                userId: result.userId,
                deviceName: result.deviceName,
                iat: new Date(result.iat * 1000).toISOString(),
                ip: result.ip,
                expirationDate: new Date(result.exp * 1000).toISOString()
            };
        }
        catch (e) {
            return null;
        }
    },
    checkRefreshToken(token) {
        try {
            const result = jsonwebtoken_1.default.verify(token, settings_1.SETTINGS.SECRET_JWT);
            return true;
        }
        catch (e) {
            return false;
        }
    }
};
