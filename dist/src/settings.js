"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SETTINGS = {
    MONGO_URL: process.env.MONGO_URL,
    ADMIN_AUTH: process.env.ADMIN_AUTH || '',
    DB_NAME: 'social_dev',
    PORT: 5000,
    PATH: {
        ROOT: '/',
        BLOGS: '/blogs',
        POSTS: '/posts',
        TEST_DELETE: '/testing/all-data'
    }
};
