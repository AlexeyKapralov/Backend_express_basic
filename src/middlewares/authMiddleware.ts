import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { SETTINGS } from '../settings'

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const auth = req.headers['authorization'] as string
	if (!auth) {
		res.status(StatusCodes.UNAUTHORIZED).json({})
		return
	}
	const buff = Buffer.from(auth.slice(5), 'base64')
	const decodedAuth = buff.toString('utf-8')

	if (decodedAuth !== SETTINGS.ADMIN_AUTH || auth.slice(0, 5) !== 'Basic') {
		res.status(StatusCodes.UNAUTHORIZED).json({})
		return
	}
	next()
}
