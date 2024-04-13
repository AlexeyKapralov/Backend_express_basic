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
const blogs_repository_1 = require("../../repositories/blogs.repository");
const http_status_codes_1 = require("http-status-codes");
const express_validator_1 = require("express-validator");
const inputValidationMiddleware_1 = require("../../middlewares/inputValidationMiddleware");
const nameValidation = (0, express_validator_1.body)('name')
    // name: string,maxlength 15
    .isLength({ min: 1, max: 15 })
    .customSanitizer(value => {
    return value.toString();
});
const descriptionValidation = (0, express_validator_1.body)('description')
    // description: string,
    .isLength({ min: 1, max: 500 })
    .customSanitizer(value => {
    return value.toString();
});
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    // websiteUrl: string, pattern for url
    .isLength({ min: 1, max: 100 })
    .customSanitizer(value => {
    return value.toString();
})
    .isURL();
const getBlogViewModel = (dbBlog) => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        description: dbBlog.description,
        websiteUrl: dbBlog.websiteUrl,
        createdAt: dbBlog.createdAt,
        isMembership: dbBlog.isMembership
    };
};
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.websiteUrl || req.query.name || req.query.description) {
        const result = yield blogs_repository_1.blogsRepository.getBlogs(req.query);
        res.send(result);
    }
    else {
        const result = yield blogs_repository_1.blogsRepository.getBlogs();
        res.send(result);
    }
}));
exports.blogsRouter.post('/', nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blogs_repository_1.blogsRepository.createBlog(req.body);
    if (result) {
        res.status(http_status_codes_1.StatusCodes.CREATED).send(result);
    }
    else {
        res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}));
