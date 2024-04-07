import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {HTTP_STATUSES} from "../utils/utils";
import {FieldValidationError} from "express-validator/src/base";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const myValidationResult = validationResult.withDefaults({
        formatter: (error) => {
            const error2 = error as FieldValidationError
            return {
                message: error2.msg,
                field: error2.path
            };
        },

    })

    const errors = myValidationResult(req)
    if (!errors.isEmpty()) {
        //only first error option returns only one error for each field
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errors: errors.array({onlyFirstError: true})})
    } else {
        next()
    }
}