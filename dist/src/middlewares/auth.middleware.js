"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const settings_1 = require("../common/config/settings");
const ioc_1 = require("../ioc");
const jwtService_1 = require("../common/adapters/jwtService");
const usersQuery_repository_1 = require("../features/users/repository/usersQuery.repository");
//todo 13.06.2024 нет понимания аритектурно правильно ли так делать
const jwtService = ioc_1.container.resolve(jwtService_1.JwtService);
const usersQueryRepository = ioc_1.container.resolve(usersQuery_repository_1.UsersQueryRepository);
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({});
        return;
    }
    const typeAuth = req.headers.authorization.split(' ')[0];
    if (typeAuth === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        const userId = jwtService.getUserIdByToken(token);
        let result;
        if (userId) {
            result = yield usersQueryRepository.findUserById(userId.toString());
        }
        if (result) {
            req.userId = result.id;
            next();
            return;
        }
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({});
        return;
    }
    if (typeAuth === 'Basic') {
        const auth = req.headers['authorization'];
        const buff = Buffer.from(auth.slice(5), 'base64');
        const decodedAuth = buff.toString('utf-8');
        if (decodedAuth !== settings_1.SETTINGS.ADMIN_AUTH || auth.slice(0, 5) !== 'Basic') {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({});
            return;
        }
        next();
    }
});
exports.authMiddleware = authMiddleware;
