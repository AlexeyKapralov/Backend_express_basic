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
exports.getUserIdFromTokenMiddleware = void 0;
const settings_1 = require("../common/config/settings");
const ioc_1 = require("../ioc");
const jwtService_1 = require("../common/adapters/jwtService");
const usersQuery_repository_1 = require("../features/users/repository/usersQuery.repository");
//todo 13.06.2024 нет понимания аритектурно правильно ли так делать
const jwtService = ioc_1.container.resolve(jwtService_1.JwtService);
const usersQueryRepository = ioc_1.container.resolve(usersQuery_repository_1.UsersQueryRepository);
const getUserIdFromTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let typeAuth;
    try {
        typeAuth = req.headers.authorization.split(' ')[0];
    }
    catch (_a) {
        typeAuth = null;
    }
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
        // res.status(StatusCodes.UNAUTHORIZED).json({})
        return;
    }
    if (typeAuth === 'Basic') {
        const auth = req.headers['authorization'];
        const buff = Buffer.from(auth.slice(5), 'base64');
        const decodedAuth = buff.toString('utf-8');
        if (decodedAuth !== settings_1.SETTINGS.ADMIN_AUTH || auth.slice(0, 5) !== 'Basic') {
            // res.status(StatusCodes.UNAUTHORIZED).json({})
            return;
        }
        next();
    }
    next();
});
exports.getUserIdFromTokenMiddleware = getUserIdFromTokenMiddleware;
