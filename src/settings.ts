import {config} from "dotenv";

config()

export const SETTINGS = {
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL,
    PATH: {
        BLOGS: '/blogs'
    }
}