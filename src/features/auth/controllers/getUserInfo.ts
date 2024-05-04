import { Request, Response } from 'express'
import { IMeViewModel } from '../models/meView.model'
import { usersQueryRepository } from '../../../repositories/users/usersQuery.repository'
import { getUserInfo } from '../../../common/utils/mappers'
import { StatusCodes } from 'http-status-codes'

export const getUserInfoController = async (req: Request, res: Response<IMeViewModel>) => {
	const user = await usersQueryRepository.findUserById(req.userId!)

	user ? res.status(StatusCodes.OK).json(getUserInfo(user!)) : res.status(StatusCodes.NOT_FOUND).json()
}