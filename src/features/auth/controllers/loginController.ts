import { Request, Response } from 'express'
import { ILoginInputModel } from '../../users/models/login.input.model'
import { loginService } from '../../../service/login.service'
import { StatusCodes } from 'http-status-codes'

export const loginController = async (
	req: Request<{}, {}, ILoginInputModel>,
	res: Response<boolean>
) => {
	const result = await loginService.loginUser(req.body)

	result
		? res.status(StatusCodes.NO_CONTENT).send()
		: res.status(StatusCodes.UNAUTHORIZED).send()
}
