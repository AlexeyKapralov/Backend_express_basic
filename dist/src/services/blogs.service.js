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
exports.blogsService = exports.getPostViewModel = void 0;
const blogs_repository_1 = require("../repositories/blogs.repository");
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const http_status_codes_1 = require("http-status-codes");
const posts_repository_1 = require("../repositories/posts.repository");
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
const getPostViewModel = (post) => {
    return {
        id: post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    };
};
exports.getPostViewModel = getPostViewModel;
exports.blogsService = {
    findBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_repository_1.blogsRepository.findBlogs(query);
            const countDocs = yield blogs_repository_1.blogsRepository.countBlogs(query.searchNameTerm ? query.searchNameTerm : undefined);
            if (result.length > 0) {
                const resultView = {
                    pagesCount: Math.ceil(countDocs / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount: countDocs,
                    items: result.map(getBlogViewModel)
                };
                return resultView;
            }
            else {
                return undefined;
            }
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield blogs_repository_1.blogsRepository.findBlogById(id);
            return foundBlog ? getBlogViewModel(foundBlog) : null;
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = {
                _id: String(new mongodb_1.ObjectId()),
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: String(new Date().toISOString()),
                isMembership: false
            };
            yield blogs_repository_1.blogsRepository.createBlog(blog);
            return getBlogViewModel(blog);
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield blogs_repository_1.blogsRepository.updateBlog(id, body);
            return isUpdated ? http_status_codes_1.StatusCodes.NO_CONTENT : http_status_codes_1.StatusCodes.NOT_FOUND;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield blogs_repository_1.blogsRepository.deleteBlog(id);
            return isUpdated ? http_status_codes_1.StatusCodes.NO_CONTENT : http_status_codes_1.StatusCodes.NOT_FOUND;
        });
    },
    findPostsByBlogId(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield posts_repository_1.postRepository.getPostsByBlogId(id, query);
            if (result.length !== 0) {
                const countPosts = yield posts_repository_1.postRepository.countPosts(id);
                const posts = result.map(exports.getPostViewModel);
                const resultView = {
                    pagesCount: Math.ceil(countPosts / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount: countPosts,
                    items: posts
                };
                return resultView;
            }
            else {
                return null;
            }
        });
    },
    createPostForBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogsCollection.findOne({
                _id: id
            });
            if (blog !== null) {
                const post = {
                    _id: String(new mongodb_1.ObjectId()),
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: blog._id,
                    blogName: blog.name,
                    createdAt: new Date().toISOString()
                };
                const result = yield posts_repository_1.postRepository.createPostForBlog(post);
                if (result.acknowledged === true) {
                    return (0, exports.getPostViewModel)(post);
                }
            }
            else
                return undefined;
        });
    }
};
