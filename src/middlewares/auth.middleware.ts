import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { jwtService } from '../common/adapters/jwt.service'
import { usersQueryRepository } from '../repositories/users/usersQuery.repository'
import { SETTINGS } from '../common/config/settings'

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const auth: string | undefined = req.headers.authorization
	if (!auth) {
		res.status(StatusCodes.UNAUTHORIZED).json({})
		return
	}

	const typeAuth = req.headers.authorization!.split(' ')[0]

	if (typeAuth === 'Bearer') {
		const token = req.headers.authorization!.split(' ')[1]

		const userId = jwtService.getUserIdByToken(token)

		let result
		if (userId) {
			result = await usersQueryRepository.findUserById(userId.toString())
		}
		if (result) {
			req.userId = result!.id
			next()
			return
		}
		res.status(StatusCodes.UNAUTHORIZED).json({})
		return
	}
	if (typeAuth === 'Basic') {
		const auth = req.headers['authorization'] as string
		const buff = Buffer.from(auth.slice(5), 'base64')
		const decodedAuth = buff.toString('utf-8')

		if (decodedAuth !== SETTINGS.ADMIN_AUTH || auth.slice(0, 5) !== 'Basic') {
			res.status(StatusCodes.UNAUTHORIZED).json({})
			return
		}
		next()
	}

}
