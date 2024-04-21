"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const getBlogsController_1 = require("./getBlogsController");
const createBlogController_1 = require("./createBlogController");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const inputValidationMiddleware_1 = require("../../middlewares/inputValidationMiddleware");
const getBlogByIdController_1 = require("./getBlogByIdController");
const updateBlogController_1 = require("./updateBlogController");
const deleteBlogByIdController_1 = require("./deleteBlogByIdController");
const getPostsByBlogIdController_1 = require("./getPostsByBlogIdController");
const createPostByBlogIdController_1 = require("./createPostByBlogIdController");
const nameValidation = (0, express_validator_1.body)('name')
    .trim()
    .isLength({ min: 1, max: 15 })
    .exists();
// .customSanitizer(value => {
// 	return value.toString()
// })
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
const descriptionValidation = (0, express_validator_1.body)('description')
    .trim()
    .isLength({ min: 1, max: 500 })
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
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .isLength({ min: 1, max: 100 })
    .exists()
    // .customSanitizer(value => {
    // 	return value.toString()
    // })
    .isURL();
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', getBlogsController_1.getBlogsController);
exports.blogsRouter.get('/:id/posts', getPostsByBlogIdController_1.getPostsByBlogIdController);
exports.blogsRouter.get('/:id', getBlogByIdController_1.getBlogByIdController);
exports.blogsRouter.post('/:id/posts', authMiddleware_1.authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware_1.inputValidationMiddleware, createPostByBlogIdController_1.createPostByBlogIdController);
exports.blogsRouter.post('/', authMiddleware_1.authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware_1.inputValidationMiddleware, createBlogController_1.createBlogController);
exports.blogsRouter.put('/:id', authMiddleware_1.authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware_1.inputValidationMiddleware, updateBlogController_1.updateBlogController);
exports.blogsRouter.delete('/:id', authMiddleware_1.authMiddleware, deleteBlogByIdController_1.deleteBlogByIdController);
