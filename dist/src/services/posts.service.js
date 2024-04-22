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
exports.postsService = void 0;
const mongodb_1 = require("mongodb");
const posts_repository_1 = require("../repositories/posts.repository");
const blogs_service_1 = require("./blogs.service");
const blogs_repository_1 = require("../repositories/blogs.repository");
const posts_query_repository_1 = require("../repositories/posts.query.repository");
exports.postsService = {
    getAllPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield posts_query_repository_1.postQueryRepository.findAllPosts(query);
            const countPosts = yield posts_repository_1.postRepository.countPosts();
            if (res.length !== 0) {
                return {
                    pagesCount: Math.ceil(countPosts / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount: countPosts,
                    items: res.map(blogs_service_1.getPostViewModel)
                };
            }
            else {
                return undefined;
            }
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield posts_repository_1.postRepository.findPostById(id);
            return res ? (0, blogs_service_1.getPostViewModel)(res) : undefined;
        });
    },
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_repository_1.blogsRepository.findBlogById(body.blogId);
            if (blog !== null) {
                const post = {
                    _id: String(new mongodb_1.ObjectId()),
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                    blogName: blog.name,
                    createdAt: String(new Date().toISOString())
                };
                const isCreated = yield posts_repository_1.postRepository.createPost(post);
                return isCreated ? (0, blogs_service_1.getPostViewModel)(post) : undefined;
            }
            else {
                return undefined;
            }
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postRepository.updatePost(id, body);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postRepository.deletePost(id);
        });
    }
};
