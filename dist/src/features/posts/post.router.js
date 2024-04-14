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
exports.postRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../../repositories/posts.repository");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
const inputValidationMiddleware_1 = require("../../middlewares/inputValidationMiddleware");
const db_1 = require("../../db/db");
const titleValidation = (0, express_validator_1.body)('title')
    // name: string,maxlength 15
    // .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .exists();
// .customSanitizer(value => {
// 	return value.toString()
// })
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    // name: string,maxlength 15
    // .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .exists();
// .customSanitizer(value => {
// 	return value.toString()
// })
const contentValidation = (0, express_validator_1.body)('content')
    // name: string,maxlength 15
    // .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .exists();
// .customSanitizer(value => {
// 	return value.toString()
// })
const blogIdValidation = (0, express_validator_1.body)('blogId')
    // name: string,maxlength 15
    // .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield db_1.blogsCollection.findOne({ _id: value });
    if (!foundBlog) {
        throw new Error('Unknown blogId');
    }
}))
    .exists();
// .customSanitizer(value => {
// 	return value.toString()
// })
exports.postRouter = (0, express_1.Router)({});
exports.postRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.title ||
        req.query.shortDescription ||
        req.query.content ||
        req.query.blogId) {
        const result = yield posts_repository_1.postsRepository.getPosts(req.query);
        res.send(result);
    }
    else {
        const result = yield posts_repository_1.postsRepository.getPosts();
        res.send(result);
    }
}));
exports.postRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield posts_repository_1.postsRepository.getPostById(req.params.id);
    if (result) {
        res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    else {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
    }
}));
exports.postRouter.post('/', auth_middleware_1.authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield posts_repository_1.postsRepository.createPost(req.body);
    if (result) {
        res.status(http_status_codes_1.StatusCodes.CREATED).json(result);
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
exports.postRouter.put('/:id', auth_middleware_1.authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield posts_repository_1.postsRepository.updatePost(req.body, req.params.id);
    if (!result) {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
    }
    else {
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json();
    }
}));
exports.postRouter.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield posts_repository_1.postsRepository.deletePost(req.params.id);
    if (result) {
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json();
    }
    else {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
    }
}));
