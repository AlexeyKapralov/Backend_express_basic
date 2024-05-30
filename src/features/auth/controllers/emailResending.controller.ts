import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { loginService } from '../service/login.service'
import { ResultStatus } from '../../../common/types/resultStatus.type'

export const emailResendingController = async (req:Request<{},{},{email: string}>, res:Response<StatusCodes>) => {

	const result = await loginService.resendConfirmationCode(req.body.email)

	result.status === ResultStatus.Success ? res.sendStatus(StatusCodes.NO_CONTENT) : res.sendStatus(StatusCodes.NOT_FOUND)
}