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
exports.blogsService = void 0;
const blogs_repository_1 = require("../repositories/blogs.repository");
const getBlogViewModel = (blog) => {
    return {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
};
exports.blogsService = {
    findBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const countBlogs = yield blogs_repository_1.blogsRepository.countBlogs();
            const result = yield blogs_repository_1.blogsRepository.findBlogs(query);
            const blogs = result.map(getBlogViewModel);
            const resultView = {
                pagesCount: Math.ceil(countBlogs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countBlogs,
                items: blogs
            };
            return resultView;
        });
    }
};
