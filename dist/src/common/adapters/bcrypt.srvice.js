"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcryptService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.bcryptService = {
    createPasswordHash(password) {
        const salt = bcrypt_1.default.genSaltSync(10);
    }
};
