import { Request, Response } from 'express'
import { IUserInputModel } from '../models/userInput.model'
import { IUserViewModel } from '../models/userView.model'
import { usersService } from '../../../service/users.service'
import { StatusCodes } from 'http-status-codes'

export const createUserController = async (
	req: Request<{}, {}, IUserInputModel>,
	res: Response<IUserViewModel>
) => {
	const result = await usersService.createUser(
		req.body
	)

	result
		? res.status(StatusCodes.CREATED).send(result)
		: res.status(StatusCodes.NOT_FOUND).json()
}
