"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
exports.app = (0, express_1.default)();
const jsonMiddleware = express_1.default.json();
exports.app.use(jsonMiddleware);
exports.app.get('/', (res, req) => {
    req.status(http_status_codes_1.StatusCodes.OK).json({ version: '1' });
});
