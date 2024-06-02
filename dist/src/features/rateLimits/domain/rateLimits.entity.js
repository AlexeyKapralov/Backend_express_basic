"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RateLimitsSchema = new mongoose_1.default.Schema({
    date: { type: Date, required: true },
    url: { type: String, required: true },
    ip: { type: String, required: true }
});
exports.RateLimitModel = mongoose_1.default.model('rateLimit', RateLimitsSchema);
