import express, { Request, Response } from 'express'
import { SETTINGS } from './common/config/settings'
import { usersRouter } from './features/users/users.router'
import { authRouter } from './features/auth/authRouter'
import { db } from './db/db'
import { StatusCodes } from 'http-status-codes'
import {blogsRouter} from "./features/blogs/blogs.router";
import {postsRouter} from "./features/posts/posts.router";
import { commentsRouter } from './features/comments/comments.router'
import cookieParser from "cookie-parser";

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
	res.send('All is running!')
})
app.delete(SETTINGS.PATH.TESTING, async (req: Request, res: Response) => {
	await db.drop()
	res.status(StatusCodes.NO_CONTENT).send()
})

app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)