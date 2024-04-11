"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ version: '1' });
});
