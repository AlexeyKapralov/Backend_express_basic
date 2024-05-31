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
exports.blogsQueryRepository = void 0;
const blogsMappers_1 = require("../mappers/blogsMappers");
const postMappers_1 = require("../../posts/mappers/postMappers");
const blogs_dto_1 = require("../domain/blogs.dto");
const post_dto_1 = require("../../posts/domain/post.dto");
exports.blogsQueryRepository = {
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const newQuery = { name: { $regex: (_a = query.searchNameTerm) !== null && _a !== void 0 ? _a : '', $options: 'i' } };
            const res = yield blogs_dto_1.BlogModel
                .find(newQuery)
                .sort({ [query.sortBy]: query.sortDirection })
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .lean();
            const countDocs = yield blogs_dto_1.BlogModel
                .countDocuments(newQuery);
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: res.map(blogsMappers_1.getBlogViewModel)
            };
        });
    },
    getBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_dto_1.BlogModel.findOne({
                _id: id
            });
            return result ? (0, blogsMappers_1.getBlogViewModel)(result) : undefined;
        });
    },
    getPostsByBlogID(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield post_dto_1.PostModel
                .find({ blogId: id })
                .sort({ [query.sortBy]: query.sortDirection })
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .lean();
            const countDocs = yield post_dto_1.PostModel
                .countDocuments({ blogId: id });
            if (res.length > 0) {
                return {
                    pagesCount: Math.ceil(countDocs / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount: countDocs,
                    items: res.map(postMappers_1.getPostViewModel)
                };
            }
            else {
                return undefined;
            }
        });
    }
};
