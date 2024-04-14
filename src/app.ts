import express, { Request, Response } from 'express'
import { blogsRouter } from './features/blogs/blogs.router'
import { SETTINGS } from './settings'
import { testRouter } from './features/test/test.router'
import { postRouter } from './features/posts/post.router'

export const app = express()

const jsonMiddleware = express.json()

app.use(jsonMiddleware)

app.get('/', (req: Request, res: Response) => res.send('All is running'))
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.TEST_DELETE, testRouter)
