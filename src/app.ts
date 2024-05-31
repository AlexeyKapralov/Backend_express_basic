import express, {Request, Response} from 'express'
import {SETTINGS} from './common/config/settings'
import {usersRouter} from './features/users/users.router'
import {authRouter} from './features/auth/authRouter'
import {db} from './db/db'
import {StatusCodes} from 'http-status-codes'
import {blogsRouter} from "./features/blogs/blogs.router";
import {postsRouter} from "./features/posts/posts.router";
import {commentsRouter} from './features/comments/comments.router'
import cookieParser from "cookie-parser";
import {securityDevicesRouter} from "./features/securityDevices/securityDevices.router";
import {PATH} from "./common/config/path";

export const app = express()

app.set('trust proxy', true)
app.use(express.json())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.send('All is running!')
})
app.delete(PATH.TESTING, async (req: Request, res: Response) => {
    await db.drop()
    res.status(StatusCodes.NO_CONTENT).send()
})

app.use(PATH.USERS, usersRouter)
app.use(PATH.BLOGS, blogsRouter)
app.use(PATH.COMMENTS, commentsRouter)
app.use(PATH.POSTS, postsRouter)
app.use(PATH.AUTH, authRouter)
app.use(PATH.SECURITY, securityDevicesRouter)