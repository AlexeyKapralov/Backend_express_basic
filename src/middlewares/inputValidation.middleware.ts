import { Request, Response, NextFunction } from 'express'
import { FieldValidationError, validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

export const inputValidationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const myValidationResult = validationResult.withDefaults({
		formatter: error => {
			const curError = error as FieldValidationError
			return {
				message: curError.msg,
				field: curError.path
			}
		}
	})

	const errors = myValidationResult(req)
	if (!errors.isEmpty()) {
		res
			.status(StatusCodes.NOT_FOUND)
			.json({ errorsMessages: errors.array({ onlyFirstError: true }) })
	} else {
		next()
	}
}
