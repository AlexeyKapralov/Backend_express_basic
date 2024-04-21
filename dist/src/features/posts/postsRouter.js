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
exports.postsRouter = void 0;
const express_1 = require("express");
const getPostsController_1 = require("./getPostsController");
const createPostController_1 = require("./createPostController");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const inputValidationMiddleware_1 = require("../../middlewares/inputValidationMiddleware");
const getPostByIdController_1 = require("./getPostByIdController.");
const updatePostController_1 = require("./updatePostController");
const deletePostController_1 = require("./deletePostController");
const db_1 = require("../../db/db");
const titleValidation = (0, express_validator_1.body)('title')
    .trim()
    .isLength({ min: 1, max: 30 })
    .exists();
// .customSanitizer(value => {
// 	return value.toString()
// })
const contentValidation = (0, express_validator_1.body)('content')
    .trim()
    .isLength({ min: 1, max: 100 })
    .exists();
// .customSanitizer(value => {
// 	return value.toString()
// })
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .trim()
    .isLength({ min: 1, max: 100 })
    .exists();
// .customSanitizer(value => {
// 	return value.toString()
// })
const blogIdValidation = (0, express_validator_1.body)('blogId')
    .trim()
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield db_1.blogsCollection.findOne({ _id: value });
    if (blog === null) {
        throw new Error('blog not found');
    }
}));
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', getPostsController_1.getPostsController);
exports.postsRouter.get('/:id', getPostByIdController_1.getPostByIdController);
exports.postsRouter.post('/', authMiddleware_1.authMiddleware, titleValidation, contentValidation, shortDescriptionValidation, blogIdValidation, inputValidationMiddleware_1.inputValidationMiddleware, createPostController_1.createPostController);
exports.postsRouter.put('/:id', authMiddleware_1.authMiddleware, titleValidation, contentValidation, shortDescriptionValidation, blogIdValidation, inputValidationMiddleware_1.inputValidationMiddleware, updatePostController_1.updatePostController);
exports.postsRouter.delete('/:id', authMiddleware_1.authMiddleware, deletePostController_1.deletePostController);
