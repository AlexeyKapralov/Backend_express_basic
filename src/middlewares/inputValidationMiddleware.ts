import { NextFunction, Request, Response } from 'express'
import { FieldValidationError, validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

export const inputValidationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const myValidationResult = validationResult.withDefaults({
		formatter: error => {
			const error2 = error as FieldValidationError
			return {
				message: error2.msg,
				field: error2.path
			}
		}
	})

	const errors = myValidationResult(req)
	if (!errors.isEmpty()) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ errorsMessages: errors.array({ onlyFirstError: true }) })
	} else {
		next()
	}
}
