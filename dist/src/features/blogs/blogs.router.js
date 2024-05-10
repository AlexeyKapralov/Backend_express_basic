"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const getBlogs_controller_1 = require("./controllers/getBlogs.controller");
const express_validation_1 = require("../../common/validation/express-validation");
const inputValidation_middleware_1 = require("../../middlewares/inputValidation.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const createBlog_controller_1 = require("./controllers/createBlog.controller");
const getBlogById_controller_1 = require("./controllers/getBlogById.controller");
const updateBlogById_controller_1 = require("./controllers/updateBlogById.controller");
const deleteBlogById_controller_1 = require("./controllers/deleteBlogById.controller");
const getPostsByBlogId_controller_1 = require("./controllers/getPostsByBlogId.controller");
const createPostByBlogId_controller_1 = require("./controllers/createPostByBlogId.controller");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', express_validation_1.searchNameTermValidation, express_validation_1.sortByValidation, express_validation_1.sortDirectionValidation, express_validation_1.pageNumberValidation, express_validation_1.pageSizeValidation, inputValidation_middleware_1.inputValidationMiddleware, getBlogs_controller_1.getBlogsController);
exports.blogsRouter.get('/:id', getBlogById_controller_1.getBlogByIdController);
exports.blogsRouter.get('/:id/posts', express_validation_1.sortByValidation, 
// blogIdParamValidation,
express_validation_1.sortDirectionValidation, express_validation_1.pageNumberValidation, express_validation_1.pageSizeValidation, inputValidation_middleware_1.inputValidationMiddleware, getPostsByBlogId_controller_1.getPostsByBlogIDController);
exports.blogsRouter.post('/', auth_middleware_1.authMiddleware, express_validation_1.nameValidation, express_validation_1.descriptionValidation, express_validation_1.websiteUrlValidation, inputValidation_middleware_1.inputValidationMiddleware, createBlog_controller_1.createBlogsController);
exports.blogsRouter.post('/:id/posts', auth_middleware_1.authMiddleware, 
// blogIdParamValidation,
express_validation_1.titleValidation, express_validation_1.shortDescriptionValidation, express_validation_1.contentValidation, inputValidation_middleware_1.inputValidationMiddleware, createPostByBlogId_controller_1.createPostByBlogIdController);
exports.blogsRouter.put('/:id', auth_middleware_1.authMiddleware, express_validation_1.nameValidation, express_validation_1.descriptionValidation, express_validation_1.websiteUrlValidation, inputValidation_middleware_1.inputValidationMiddleware, updateBlogById_controller_1.updateBlogByIdController);
exports.blogsRouter.delete('/:id', auth_middleware_1.authMiddleware, deleteBlogById_controller_1.deleteBlogByIdController);
