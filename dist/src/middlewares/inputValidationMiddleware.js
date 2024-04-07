"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const utils_1 = require("../utils/utils");
const inputValidationMiddleware = (req, res, next) => {
    const myValidationResult = express_validator_1.validationResult.withDefaults({
        formatter: (error) => {
            const error2 = error;
            return {
                message: error2.msg,
                field: error2.path
            };
        },
    });
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        //only first error option returns only one error for each field
        res.status(utils_1.HTTP_STATUSES.BAD_REQUEST_400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
