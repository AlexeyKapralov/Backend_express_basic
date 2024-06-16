"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true, match: /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/ },
    dislikesCount: { type: Number, required: true },
    likesCount: { type: Number, required: true }
});
// BlogSchema.static('getBlogByID', function getBlogByID(id: string) {
//     return this.findOne({
//         _id: id
//     });
// })
PostSchema.method('addCountLikes', function addCountLikes(count) {
    return __awaiter(this, void 0, void 0, function* () {
        this.likesCount = this.likesCount + count;
        yield this.save();
    });
});
PostSchema.method('addCountDislikes', function addCountDislikes(count) {
    return __awaiter(this, void 0, void 0, function* () {
        this.dislikesCount = this.dislikesCount + count;
        yield this.save();
    });
});
exports.PostModel = mongoose_1.default.model('posts', PostSchema);
