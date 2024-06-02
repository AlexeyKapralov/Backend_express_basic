"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = exports.BlogSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.BlogSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true, match: /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/ }
});
exports.BlogModel = mongoose_1.default.model('blogs', exports.BlogSchema);
