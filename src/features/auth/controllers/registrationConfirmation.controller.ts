import { Request, Response } from 'express'
import { IRegistrationConfirmationCodeModel } from '../models/registrationConfirmationCode.model'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import { StatusCodes } from 'http-status-codes'
import {authService} from "../authCompositionRoot";

export const registrationConfirmationController = async (req: Request<{},{},IRegistrationConfirmationCodeModel>, res:Response) => {
	const result = await authService.updateUserConfirm(req.body.code)
	result.status === ResultStatus.Success
		? res.status(StatusCodes.NO_CONTENT).send()
		: res.status(StatusCodes.NOT_FOUND).send()
}