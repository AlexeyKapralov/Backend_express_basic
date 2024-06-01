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
exports.commentsManagerTest = void 0;
const mongodb_1 = require("mongodb");
const comments_entity_1 = require("../../../src/features/comments/domain/comments.entity");
exports.commentsManagerTest = {
    createComments(count_1) {
        return __awaiter(this, arguments, void 0, function* (count, postId = 'post') {
            for (let i = 0; i < count; i++) {
                const letter = String.fromCharCode('A'.charCodeAt(0) + i);
                const comment = {
                    _id: new mongodb_1.ObjectId().toString(),
                    createdAt: new Date().toISOString(),
                    content: 'comment' + letter + i,
                    commentatorInfo: {
                        userId: 'user' + letter + i,
                        userLogin: `user${letter + i}@example.com`
                    },
                    postId: postId === 'post'
                        ? `postID`
                        : postId
                };
                yield comments_entity_1.CommentsModel.create(comment);
            }
        });
    }
};
