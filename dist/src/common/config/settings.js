"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.SETTINGS = {
    ADMIN_AUTH: process.env.ADMIN_AUTH,
    DB_NAME: 'social_dev',
    MONGO_URL: process.env.MONGO_URL || '',
    PORT: process.env.PORT,
    EXPIRED_LIFE: { minutes: 30 },
    PATH: {
        USERS: '/users',
        BLOGS: '/blogs',
        POSTS: '/posts',
        COMMENTS: '/comments',
        SECURITY: '/security',
        AUTH: '/auth',
        TESTING: '/testing/all-data'
    },
    SECRET_JWT: process.env.SECRET_JWT || '',
    LOGIN_MAIL: process.env.LOGIN_MAIL || '',
    PASS_MAIL: process.env.PASS_MAIL || '',
};
