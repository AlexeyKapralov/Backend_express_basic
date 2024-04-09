import {config} from "dotenv";

config()

export const SETTINGS = {
    PORT: process.env.PORT || 3002,
    PATH: {
        BLOGS: '/blogs',
        TESTS: '/testing/all-data',
        POSTS: '/posts'
    },
    ADMIN_AUTH: process.env.ADMIN_AUTH || ''
}