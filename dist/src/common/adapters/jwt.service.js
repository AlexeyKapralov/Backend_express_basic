"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../config/settings");
const inversify_1 = require("inversify");
let jwtService = class jwtService {
    createAccessToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, settings_1.SETTINGS.SECRET_JWT, { expiresIn: settings_1.SETTINGS.EXPIRATION.ACCESS_TOKEN });
    }
    createRefreshToken(deviceId, userId) {
        return jsonwebtoken_1.default.sign({ deviceId, userId }, settings_1.SETTINGS.SECRET_JWT, { expiresIn: settings_1.SETTINGS.EXPIRATION.REFRESH_TOKEN });
    }
    getUserIdByToken(token) {
        try {
            const result = jsonwebtoken_1.default.verify(token, settings_1.SETTINGS.SECRET_JWT);
            return result.userId;
        }
        catch (e) {
            return null;
        }
    }
    verifyAndDecodeToken(token) {
        try {
            const result = jsonwebtoken_1.default.verify(token, settings_1.SETTINGS.SECRET_JWT);
            return {
                deviceId: result.deviceId,
                userId: result.userId,
                iat: result.iat,
                exp: result.exp
            };
        }
        catch (e) {
            return null;
        }
    }
    checkRefreshToken(token) {
        try {
            jsonwebtoken_1.default.verify(token, settings_1.SETTINGS.SECRET_JWT);
            return true;
        }
        catch (e) {
            return false;
        }
    }
};
exports.jwtService = jwtService;
exports.jwtService = jwtService = __decorate([
    (0, inversify_1.injectable)()
], jwtService);
