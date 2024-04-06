import express, {json} from "express";
import {SETTINGS} from "./settings";
import {getBlogsRouter} from "./features/blogs/blogs.router";
import {getTestRouter} from "./features/test/test.router";
import {db} from "./db/db";

export const app = express()

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use(SETTINGS.PATH.BLOGS, getBlogsRouter())
app.use(SETTINGS.PATH.TESTS, getTestRouter(db))