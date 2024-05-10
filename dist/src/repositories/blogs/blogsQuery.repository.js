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
const db_1 = require("../../db/db");
const mappers_1 = require("../../common/utils/mappers");
exports.blogsQueryRepository = {
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const newQuery = { name: { $regex: (_a = query.searchNameTerm) !== null && _a !== void 0 ? _a : '', $options: 'i' } };
            const res = yield db_1.db.getCollection().blogsCollection
                .find(newQuery)
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();
            const countDocs = yield db_1.db.getCollection().blogsCollection
                .countDocuments(newQuery);
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: res.map(mappers_1.getBlogViewModel)
            };
        });
    },
    getBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollection().blogsCollection.findOne({
                _id: id
            });
            return result ? (0, mappers_1.getBlogViewModel)(result) : undefined;
        });
    },
    getPostsByBlogID(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.db.getCollection().postsCollection
                .find({ blogId: id })
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();
            const countDocs = yield db_1.db.getCollection().postsCollection
                .countDocuments({ blogId: id });
            if (res.length > 0) {
                return {
                    pagesCount: Math.ceil(countDocs / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount: countDocs,
                    items: res.map(mappers_1.getPostViewModel)
                };
            }
            else {
                return undefined;
            }
        });
    }
};
