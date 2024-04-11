import express from 'express'
import {blogsRouter} from "./features/blogs/blogs.router";
import {SETTINGS} from "./settings";

export const app = express()

const jsonMiddleware = express.json()

app.use(jsonMiddleware)

app.get('/', (req, res) => (res.send('All is running')))
app.use(SETTINGS.PATH.BLOGS, blogsRouter)