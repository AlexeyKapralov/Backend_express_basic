import { Request, Response } from 'express'
import { IUserInputModel } from '../../users/models/userInput.model'
import { StatusCodes } from 'http-status-codes'
import { loginService } from '../../../service/login.service'
import { ResultStatus } from '../../../common/types/resultStatus.type'

export const registrationController = async (req: Request<{},{},IUserInputModel>, res: Response<StatusCodes>) => {
	const result = await loginService.registrationUser(req.body)

	if (result.status === ResultStatus.Success) {
		res.status(StatusCodes.NO_CONTENT).json()
	}
	if (result.status === ResultStatus.BadRequest) {
		res.status(StatusCodes.BAD_REQUEST).json()
	}
}