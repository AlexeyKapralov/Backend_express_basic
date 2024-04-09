"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const settings_1 = require("./settings");
const blogs_router_1 = require("./features/blogs/blogs.router");
const test_router_1 = require("./features/test/test.router");
const db_1 = require("./db/db");
const posts_router_1 = require("./features/posts/posts.router");
exports.app = (0, express_1.default)();
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use(settings_1.SETTINGS.PATH.BLOGS, blogs_router_1.blogsRouter);
exports.app.use(settings_1.SETTINGS.PATH.POSTS, (0, posts_router_1.getPostsRouter)());
exports.app.use(settings_1.SETTINGS.PATH.TESTS, (0, test_router_1.getTestRouter)(db_1.db));
