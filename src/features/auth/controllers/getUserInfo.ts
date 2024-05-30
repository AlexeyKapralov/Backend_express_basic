import { Request, Response } from 'express'
import { IMeViewModel } from '../models/meView.model'
import { usersQueryRepository } from '../../users/repository/usersQuery.repository'
import { StatusCodes } from 'http-status-codes'
import {getUserInfo} from "../../users/mappers/userMappers";

export const getUserInfoController = async (req: Request, res: Response<IMeViewModel>) => {
	const user = await usersQueryRepository.findUserById(req.userId!)

	user ? res.status(StatusCodes.OK).json(getUserInfo(user!)) : res.status(StatusCodes.NOT_FOUND).json()
}