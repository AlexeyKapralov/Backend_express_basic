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
const mongodb_1 = require("mongodb");
const blogs_repository_1 = require("../repositories/blogs/blogs.repository");
const mappers_1 = require("../common/utils/mappers");
const posts_repository_1 = require("../repositories/posts/posts.repository");
const resultStatus_type_1 = require("../common/types/resultStatus.type");
//TODO: переписать всё на новый тип Result Type
exports.blogsService = {
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = {
                _id: new mongodb_1.ObjectId().toString(),
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false,
            };
            const result = yield blogs_repository_1.blogsRepository.createBlog(blog);
            return result ? {
                status: resultStatus_type_1.ResultStatus.Success,
                data: (0, mappers_1.getBlogViewModel)(blog)
            } : {
                status: resultStatus_type_1.ResultStatus.NotFound,
                errorMessage: 'blog did not find',
                data: null
            };
        });
    },
    updateBlogByID(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_1.blogsRepository.updateBlogByID(id, body);
        });
    },
    deleteBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_repository_1.blogsRepository.deleteBlogByID(id);
        });
    },
    createPostByBlogId(blogId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBody = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId,
            };
            return yield posts_repository_1.postsRepository.createPost(newBody);
        });
    }
};
