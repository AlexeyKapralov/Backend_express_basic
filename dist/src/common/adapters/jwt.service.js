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
        return jsonwebtoken_1.default.sign({ userId: userId }, settings_1.SETTINGS.SECRET_JWT, { expiresIn: "10s" });
    },
    createRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ userId: userId }, settings_1.SETTINGS.SECRET_JWT, { expiresIn: "20s" });
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
