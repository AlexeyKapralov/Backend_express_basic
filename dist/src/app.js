"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const settings_1 = require("./settings");
const blogs_router_1 = require("./features/blogs/blogs.router");
const tests_router_1 = require("./features/tests/tests.router");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.get('/', (req, res) => {
    res.send('All is running');
});
exports.app.use(settings_1.SETTINGS.PATH.TEST_DELETE, tests_router_1.testRouter);
exports.app.use(settings_1.SETTINGS.PATH.BLOGS, blogs_router_1.BlogsRouter);
