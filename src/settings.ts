import {config} from "dotenv";

config()


export const SETTINGS = {
    PORT: process.env.PORT || 3002,
    PATH: {
        BLOGS: '/blogs',
        TESTS: '/_tests_'
    }
}