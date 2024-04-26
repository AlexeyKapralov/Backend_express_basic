"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEmailTermValidation = exports.searchLoginTermValidation = exports.pageSizeValidation = exports.pageNumberValidation = exports.sortDirectionValidation = exports.sortByValidation = exports.emailValidation = exports.passwordValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidation = (0, express_validator_1.body)('login')
    .trim()
    .isLength({ min: 3, max: 10 })
    .matches('^[a-zA-Z0-9_-]*$')
    .exists();
exports.passwordValidation = (0, express_validator_1.body)('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .exists();
exports.emailValidation = (0, express_validator_1.body)('email').trim().isURL().exists();
exports.sortByValidation = (0, express_validator_1.query)('sortBy').trim().default('createdAt');
exports.sortDirectionValidation = (0, express_validator_1.query)('sortDirection')
    .trim()
    .isIn(['asc', 'desc'])
    .default('desc');
exports.pageNumberValidation = (0, express_validator_1.query)('pageNumber')
    .trim()
    .toInt()
    .default(1);
exports.pageSizeValidation = (0, express_validator_1.query)('pageSize').trim().toInt().default(10);
exports.searchLoginTermValidation = (0, express_validator_1.query)('searchLoginTerm')
    .trim()
    .default(null);
exports.searchEmailTermValidation = (0, express_validator_1.query)('searchEmailTerm')
    .trim()
    .default(null);
//     pageSize: number
//     searchLoginTerm: string
//     searchEmailTerm: string
