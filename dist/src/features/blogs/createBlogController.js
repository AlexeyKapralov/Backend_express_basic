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
exports.createBlogController = void 0;
const blogs_service_1 = require("../../services/blogs.service");
const http_status_codes_1 = require("http-status-codes");
const createBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, websiteUrl } = req.body;
    const blog = yield blogs_service_1.blogsService.createBlog({ name, description, websiteUrl });
    res.status(http_status_codes_1.StatusCodes.CREATED).json(blog);
    return;
});
exports.createBlogController = createBlogController;
