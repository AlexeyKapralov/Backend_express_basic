import express, { Request, Response } from 'express'
import { SETTINGS } from './common/config/settings'
import { usersRouter } from './features/users/users.router'
import { authRouter } from './features/auth/authRouter'
import { db } from './db/db'
import { StatusCodes } from 'http-status-codes'

export const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
	res.send('All is running!')
})
app.delete(SETTINGS.PATH.TESTING, async (req: Request, res: Response) => {
	await db.drop()
	res.status(StatusCodes.NO_CONTENT).send()
})

app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
