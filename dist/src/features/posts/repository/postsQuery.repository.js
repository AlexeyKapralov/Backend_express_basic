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
exports.postsQueryRepository = void 0;
const postMappers_1 = require("../mappers/postMappers");
const post_entity_1 = require("../domain/post.entity");
exports.postsQueryRepository = {
    getPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield post_entity_1.PostModel
                .find()
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .sort({ [query.sortBy]: query.sortDirection })
                .lean();
            const countDocs = yield post_entity_1.PostModel.countDocuments();
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: posts.map(postMappers_1.getPostViewModel)
            };
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_entity_1.PostModel.findOne({
                _id: id
            });
            return result ? (0, postMappers_1.getPostViewModel)(result) : undefined;
        });
    }
};
