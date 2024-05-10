import { Request, Response } from 'express'
import { IUserInputModel } from '../models/userInput.model'
import { IUserViewModel } from '../models/userView.model'
import { usersService } from '../../../service/users.service'
import { StatusCodes } from 'http-status-codes'
import { ResultStatus } from '../../../common/types/resultStatus.type'

export const createUserController = async (
	req: Request<{}, {}, IUserInputModel>,
	res: Response<IUserViewModel>
) => {
	const result = await usersService.createUser(
		req.body
	)

	result.status === ResultStatus.Success
		? res.status(StatusCodes.CREATED).send(result.data!)
		: res.status(StatusCodes.NOT_FOUND).json()
}
