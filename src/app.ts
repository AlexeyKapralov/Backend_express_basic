import express, { Request, Response } from 'express'
import { SETTINGS } from './settings'
import { blogsRouter } from './features/blogs/blogs.router'
import { StatusCodes } from 'http-status-codes'
import { testRouter } from './features/tests/tests.router'
import { postsRouter } from './features/posts/postsRouter'

export const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
	res.send('All is running')
})
app.use(SETTINGS.PATH.TEST_DELETE, testRouter)
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
