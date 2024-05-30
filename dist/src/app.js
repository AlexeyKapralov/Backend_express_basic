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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const users_router_1 = require("./features/users/users.router");
const authRouter_1 = require("./features/auth/authRouter");
const db_1 = require("./db/db");
const http_status_codes_1 = require("http-status-codes");
const blogs_router_1 = require("./features/blogs/blogs.router");
const posts_router_1 = require("./features/posts/posts.router");
const comments_router_1 = require("./features/comments/comments.router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const securityDevices_router_1 = require("./features/securityDevices/securityDevices.router");
const path_1 = require("./common/config/path");
exports.app = (0, express_1.default)();
exports.app.set('trust proxy', true);
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.get('/', (req, res) => {
    res.send('All is running!');
});
exports.app.delete(path_1.PATH.TESTING, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.drop();
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
}));
exports.app.use(path_1.PATH.USERS, users_router_1.usersRouter);
exports.app.use(path_1.PATH.BLOGS, blogs_router_1.blogsRouter);
exports.app.use(path_1.PATH.COMMENTS, comments_router_1.commentsRouter);
exports.app.use(path_1.PATH.POSTS, posts_router_1.postsRouter);
exports.app.use(path_1.PATH.AUTH, authRouter_1.authRouter);
exports.app.use(path_1.PATH.SECURITY, securityDevices_router_1.securityDevicesRouter);
