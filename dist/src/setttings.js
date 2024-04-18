"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
exports.SETTINGS = {
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
    DB_NAME: 'social_dev',
    PORT: 5000,
    PATH: {
        ROOT: '/',
        BLOGS: '/blogs',
        POSTS: '/posts'
    }
};
