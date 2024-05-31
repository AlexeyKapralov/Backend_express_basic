"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = exports.UserSchema = void 0;
//todo переписать с использование WithID
const mongoose_1 = __importDefault(require("mongoose"));
exports.UserSchema = new mongoose_1.default.Schema({
    _id: { type: String, require: true },
    login: { type: String, require: true },
    email: { type: String, require: true },
    createdAt: { type: String, require: true },
    password: { type: String, require: true },
    confirmationCode: { type: String, require: true },
    confirmationCodeExpired: { type: Date, require: true },
    isConfirmed: { type: Boolean, require: true }
});
exports.UsersModel = mongoose_1.default.model('users', exports.UserSchema);
