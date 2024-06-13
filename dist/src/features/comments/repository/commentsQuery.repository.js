"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.CommentsQueryRepository = void 0;
const commentsMappers_1 = require("../mappers/commentsMappers");
const post_entity_1 = require("../../posts/domain/post.entity");
const comments_entity_1 = require("../domain/comments.entity");
const inversify_1 = require("inversify");
let CommentsQueryRepository = class CommentsQueryRepository {
    getComments(postId_1, query_1) {
        return __awaiter(this, arguments, void 0, function* (postId, query, userId = 'default') {
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
                items: comments.map(i => (0, commentsMappers_1.getCommentView)(i, userId))
            };
        });
    }
    getCommentById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, userId = 'default') {
            const result = yield comments_entity_1.CommentsModel.findOne({ _id: id });
            if (userId !== 'default') {
                return result ? (0, commentsMappers_1.getCommentView)(result, userId) : undefined;
            }
            return result ? (0, commentsMappers_1.getCommentView)(result) : undefined;
        });
    }
};
exports.CommentsQueryRepository = CommentsQueryRepository;
exports.CommentsQueryRepository = CommentsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentsQueryRepository);
