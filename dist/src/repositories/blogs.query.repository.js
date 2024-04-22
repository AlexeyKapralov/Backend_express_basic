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
const db_1 = require("../db/db");
const blogs_repository_1 = require("./blogs.repository");
const blogs_service_1 = require("../services/blogs.service");
exports.blogsQueryRepository = {
    findBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection
                .find({
                name: { $regex: query.searchNameTerm || '', $options: 'i' }
            })
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();
            const countDocs = yield blogs_repository_1.blogsRepository.countBlogs(query.searchNameTerm ? query.searchNameTerm : undefined);
            if (result.length > 0) {
                const resultView = {
                    pagesCount: Math.ceil(countDocs / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount: countDocs,
                    items: result.map(blogs_service_1.getBlogViewModel)
                };
                return resultView;
            }
            else {
                return undefined;
            }
        });
    }
};
