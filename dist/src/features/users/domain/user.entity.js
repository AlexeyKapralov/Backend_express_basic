"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.UserSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    password: { type: String, required: true },
    confirmationCode: { type: String, required: true },
    confirmationCodeExpired: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true }
});
exports.UsersModel = mongoose_1.default.model('users', exports.UserSchema);
