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
exports.getPostsRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../../repositories/posts-repository");
const express_validator_1 = require("express-validator");
const inputValidationMiddleware_1 = require("../../middlewares/inputValidationMiddleware");
const blogs_repository_1 = require("../../repositories/blogs-repository");
const utils_1 = require("../../utils/utils");
const auth_middleware_1 = require("../../middlewares/auth-middleware");
const getPostViewModel = (dbPost) => {
    return {
        id: dbPost.id,
        blogId: dbPost.blogId,
        content: dbPost.content,
        title: dbPost.title,
        blogName: dbPost.blogName,
        shortDescription: dbPost.shortDescription
    };
};
const titleValidation = (0, express_validator_1.body)('title')
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape();
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape();
const contentValidation = (0, express_validator_1.body)('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape();
const blogIdValidation = (0, express_validator_1.body)('blogId')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const foundedBlog = yield blogs_repository_1.blogsRepository.getBlogById(value);
    if (!foundedBlog) {
        throw new Error(`BlogId ${value} no founded`);
    }
}))
    .trim()
    .isLength({ min: 1, max: 1000 })
    .escape();
const getPostsRouter = () => {
    const courseRouter = (0, express_1.Router)({});
    courseRouter.get('/', (req, res) => {
        const foundPosts = posts_repository_1.postsRepository.getPosts(req.query.title || undefined);
        if (foundPosts) {
            res.status(utils_1.HTTP_STATUSES.OK_200).json(foundPosts.map(getPostViewModel));
        }
    });
    courseRouter.post('/', auth_middleware_1.authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => {
        const createdPost = posts_repository_1.postsRepository.createPost(req.body);
        if (createdPost) {
            res.status(utils_1.HTTP_STATUSES.CREATED_201).json(createdPost);
        }
        else
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    });
    courseRouter.put('/:id', auth_middleware_1.authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => {
        const isUpdated = posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
        if (isUpdated) {
            res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    });
    courseRouter.get('/:id', (req, res) => {
        const foundedPost = posts_repository_1.postsRepository.getPostById(req.params.id);
        if (foundedPost) {
            res.status(utils_1.HTTP_STATUSES.OK_200).send(foundedPost);
        }
        else {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    });
    courseRouter.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => {
        const isDel = posts_repository_1.postsRepository.deletePost(req.params.id);
        if (isDel) {
            res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        }
        else {
            res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }
    });
    return courseRouter;
};
exports.getPostsRouter = getPostsRouter;
