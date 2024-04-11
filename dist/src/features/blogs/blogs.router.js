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
exports.blogsRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../../utils/utils");
const blogs_repository_1 = require("../../repositories/blogs-repository");
const express_validator_1 = require("express-validator");
const inputValidationMiddleware_1 = require("../../middlewares/inputValidationMiddleware");
const auth_middleware_1 = require("../../middlewares/auth-middleware");
//validation
//escape для защиты от XSS
const nameValidation = (0, express_validator_1.body)('name')
    .trim()
    .isLength({ min: 1, max: 15 }).withMessage('max length 15 symbols')
    .escape();
const descriptionValidation = (0, express_validator_1.body)('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape();
const webSiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .trim()
    .isURL()
    // body('websiteUrl').matches('`^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n').withMessage('should
    // be URL template').escape()
    .isLength({ min: 1, max: 100 })
    .withMessage('should be URL template');
// .escape()
//router
// export const getBlogsRouter = () => {
exports.blogsRouter = (0, express_1.Router)({});
const getBlogViewModel = (dbBlog) => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        description: dbBlog.description,
        websiteUrl: dbBlog.websiteUrl
    };
};
//get blogs
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundedBlogs = yield blogs_repository_1.blogsRepository.getBlogs(req.query.name);
    res.status(utils_1.HTTP_STATUSES.OK_200).json(foundedBlogs.map(getBlogViewModel));
}));
// create post
exports.blogsRouter.post('/', auth_middleware_1.authMiddleware, nameValidation, descriptionValidation, webSiteUrlValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdBlog = yield blogs_repository_1.blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    if (createdBlog) {
        res.status(utils_1.HTTP_STATUSES.CREATED_201).json(createdBlog);
    }
    else {
        res.sendStatus(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
    }
}));
//get blog by ID
exports.blogsRouter.get('/:id', 
// idValidation,
// inputValidationMiddleware,
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundedBlog = yield blogs_repository_1.blogsRepository.getBlogById(req.params.id);
    if (foundedBlog) {
        res.status(utils_1.HTTP_STATUSES.OK_200).json(getBlogViewModel(foundedBlog));
        return;
    }
    res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
}));
//update blogs
exports.blogsRouter.put('/:id', auth_middleware_1.authMiddleware, nameValidation, descriptionValidation, webSiteUrlValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield blogs_repository_1.blogsRepository.updateBlog(req.params.id, req.body);
    if (isUpdated) {
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
    }
    else {
        res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
//delete blog
exports.blogsRouter.delete('/:id', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (isDeleted) {
        res.sendStatus(utils_1.HTTP_STATUSES.NO_CONTENT_204);
    }
    else {
        res.sendStatus(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
//     return blogsRouter
// }
