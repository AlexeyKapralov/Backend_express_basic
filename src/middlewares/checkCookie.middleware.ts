import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { jwtService } from '../common/adapters/jwt.service'

export const checkCookieMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const refreshToken = req.cookies.refreshToken
	if (!refreshToken) {
		res.status(StatusCodes.UNAUTHORIZED).send()
		return
	}

	const isValidToken = jwtService.checkRefreshToken(refreshToken)
	if (!isValidToken) {
		res.status(StatusCodes.UNAUTHORIZED).send()
		return
	}

	next()
}
