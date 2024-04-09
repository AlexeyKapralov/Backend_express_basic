import express from "express";
import {SETTINGS} from "./settings";
import {blogsRouter} from "./features/blogs/blogs.router";
import {testRouter} from "./features/test/test.router";
import {postsRouter} from "./features/posts/posts.router";

export const app = express()

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTS, testRouter)
