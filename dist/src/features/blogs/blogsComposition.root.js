"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsService = void 0;
const blogs_service_1 = require("./sevice/blogs.service");
const blogs_repository_1 = require("./repository/blogs.repository");
const posts_repository_1 = require("../posts/repository/posts.repository");
const blogsRepository = new blogs_repository_1.BlogsRepository();
const postsRepository = new posts_repository_1.PostsRepository(blogsRepository);
exports.blogsService = new blogs_service_1.BlogsService(blogsRepository, postsRepository);
