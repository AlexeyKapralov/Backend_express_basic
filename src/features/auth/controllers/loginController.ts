import { Request, Response } from 'express'
import { loginService } from '../../../service/login.service'
import { StatusCodes } from 'http-status-codes'
import {ILoginInputModel} from "../models/loginInputModel";

export const loginController = async (
	req: Request<{}, {}, ILoginInputModel>,
	res: Response<boolean>
) => {
	const result = await loginService.loginUser(req.body)

	result
		? res.status(StatusCodes.NO_CONTENT).send()
		: res.status(StatusCodes.UNAUTHORIZED).send()
}
