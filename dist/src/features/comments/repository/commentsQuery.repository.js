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
exports.commentsQueryRepository = void 0;
const commentsMappers_1 = require("../mappers/commentsMappers");
const post_entity_1 = require("../../posts/domain/post.entity");
const comments_entity_1 = require("../domain/comments.entity");
exports.commentsQueryRepository = {
    getComments(postId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield post_entity_1.PostModel.findOne({ _id: postId });
            if (!post) {
                return undefined;
            }
            const comments = yield comments_entity_1.CommentsModel
                .find({ postId: postId })
                .sort({ [query.sortBy]: query.sortDirection })
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .lean();
            const commentsCount = yield comments_entity_1.CommentsModel
                .countDocuments({ postId: postId });
            return {
                pagesCount: Math.ceil(commentsCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: commentsCount,
                items: comments.map(commentsMappers_1.getCommentView)
            };
        });
    },
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield comments_entity_1.CommentsModel.findOne({ _id: id });
            return result ? (0, commentsMappers_1.getCommentView)(result) : undefined;
        });
    }
};
