import { Request, Response } from 'express'
import { IUserInputModel } from '../models/user.input.model'
import { IUserViewModel } from '../models/user.view.model'
import { usersService } from '../../../service/users.service'
import { StatusCodes } from 'http-status-codes'

export const createPostController = async (
	req: Request<{}, {}, IUserInputModel>,
	res: Response<IUserViewModel>
) => {
	const result = await usersService.createUser(
		req.body,
		req.headers.authorization!
	)

	result
		? res.status(StatusCodes.CREATED).send(result)
		: res.status(StatusCodes.NOT_FOUND).json()
}
