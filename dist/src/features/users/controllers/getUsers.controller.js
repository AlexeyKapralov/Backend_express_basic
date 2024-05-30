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
exports.getUsersController = void 0;
const http_status_codes_1 = require("http-status-codes");
const usersQuery_repository_1 = require("../repository/usersQuery.repository");
const mappers_1 = require("../../../common/utils/mappers");
const getUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, mappers_1.getQueryParams)(req.query);
    const result = yield usersQuery_repository_1.usersQueryRepository.findUsers(query);
    res.status(http_status_codes_1.StatusCodes.OK).send(result);
});
exports.getUsersController = getUsersController;
