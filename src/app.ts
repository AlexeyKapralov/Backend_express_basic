import express, { Request, Response } from 'express'
import { SETTINGS } from './settings'
import { BlogsRouter } from './features/blogs/blogs.router'
import { StatusCodes } from 'http-status-codes'
import { testRouter } from './features/tests/tests.router'

export const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
	res.send('All is running')
})
app.use(SETTINGS.PATH.TEST_DELETE, testRouter)
app.use(SETTINGS.PATH.BLOGS, BlogsRouter)
