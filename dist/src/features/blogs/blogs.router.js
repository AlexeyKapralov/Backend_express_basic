"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRouter = void 0;
const express_1 = require("express");
const getBlogsController_1 = require("./getBlogsController");
const createBlogsController_1 = require("./createBlogsController");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const inputValidationMiddleware_1 = require("../../middlewares/inputValidationMiddleware");
const nameValidation = (0, express_validator_1.body)('name')
    .trim()
    .isLength({ min: 1, max: 15 })
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
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .isLength({ min: 1, max: 100 })
    .exists()
    // .customSanitizer(value => {
    // 	return value.toString()
    // })
    .isURL();
exports.BlogsRouter = (0, express_1.Router)({});
exports.BlogsRouter.get('/', getBlogsController_1.getBlogsController);
exports.BlogsRouter.post('/', authMiddleware_1.authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware_1.inputValidationMiddleware, createBlogsController_1.createBlogsController);
