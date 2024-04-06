"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogsRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../../utils/utils");
const blogs_repository_1 = require("../../repositories/blogs-repository");
const getBlogsRouter = () => {
    const blogsRouter = (0, express_1.Router)({});
    const getBlogViewModel = (dbBlog) => {
        return {
            id: dbBlog.id,
            name: dbBlog.name,
            description: dbBlog.description,
            websiteUrl: dbBlog.websiteUrl
        };
    };
    blogsRouter.get('/', (req, res) => {
        const foundedBlogs = blogs_repository_1.blogsRepository.getBlogs(req.query.name);
        res.status(utils_1.HTTP_STATUSES.OK_200).json(foundedBlogs.map(getBlogViewModel));
    });
    return blogsRouter;
};
exports.getBlogsRouter = getBlogsRouter;
