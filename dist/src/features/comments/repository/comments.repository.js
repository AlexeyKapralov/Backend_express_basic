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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRepository = void 0;
const mongodb_1 = require("mongodb");
const comments_entity_1 = require("../domain/comments.entity");
exports.commentsRepository = {
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_entity_1.CommentsModel.findOne({ _id: id });
            return result ? result : undefined;
        });
    },
    createComment(user, post, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = {
                _id: new mongodb_1.ObjectId().toString(),
                content: data.content,
                commentatorInfo: {
                    userId: user._id,
                    userLogin: user.login
                },
                createdAt: new Date().toISOString(),
                postId: post._id
            };
            const result = yield comments_entity_1.CommentsModel.create(newComment);
            return !!result ? newComment : undefined;
        });
    },
    updateComment(commentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdatedComment = yield comments_entity_1.CommentsModel
                .updateOne({ _id: commentId }, {
                $set: {
                    content: data.content
                }
            });
            return isUpdatedComment.modifiedCount > 0;
        });
    },
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield comments_entity_1.CommentsModel.deleteOne({ _id: commentId });
            return isDeleted.deletedCount > 0;
        });
    }
};
