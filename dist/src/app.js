"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./features/blogs/blogs.router");
const settings_1 = require("./settings");
const test_router_1 = require("./features/test/test.router");
exports.app = (0, express_1.default)();
const jsonMiddleware = express_1.default.json();
exports.app.use(jsonMiddleware);
exports.app.get('/', (req, res) => (res.send('All is running')));
exports.app.use(settings_1.SETTINGS.PATH.BLOGS, blogs_router_1.blogsRouter);
exports.app.use(settings_1.SETTINGS.PATH.TEST_DELETE, test_router_1.testRouter);
