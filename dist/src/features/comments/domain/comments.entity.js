"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommentatorInfo = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    userLogin: { type: String, required: true }
});
const LikesSchema = new mongoose_1.default.Schema({
    createdAt: { type: Date, required: true },
    status: { type: String, required: true },
    userId: { type: String, required: true },
});
const CommentsSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: String, required: true, match: /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/ },
    postId: { type: String, required: true },
    commentatorInfo: CommentatorInfo,
    likes: [LikesSchema],
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
});
exports.CommentsModel = mongoose_1.default.model('comments', CommentsSchema);
