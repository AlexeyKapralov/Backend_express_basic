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
exports.getUserInfoController = void 0;
const usersQuery_repository_1 = require("../../../repositories/users/usersQuery.repository");
const mappers_1 = require("../../../common/utils/mappers");
const http_status_codes_1 = require("http-status-codes");
const getUserInfoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersQuery_repository_1.usersQueryRepository.findUserById(req.userId);
    user ? res.status(http_status_codes_1.StatusCodes.OK).json((0, mappers_1.getUserInfo)(user)) : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
});
exports.getUserInfoController = getUserInfoController;
