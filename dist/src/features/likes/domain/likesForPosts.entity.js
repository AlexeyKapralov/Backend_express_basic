"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesPostsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LikesPostsSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    addedAt: { type: Date, required: true },
    login: { type: String, required: true },
    description: { type: String, required: true },
    postId: { type: String, required: true }
});
exports.LikesPostsModel = mongoose_1.default.model('likesPosts', LikesPostsSchema);
