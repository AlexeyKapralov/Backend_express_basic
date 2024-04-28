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
const mappers_1 = require("../../../common/utils/mappers");
const users_query_repository_1 = require("../../../repositories/users/users.query.repository");
const getUsersController = (
//TODO: Здесь для query нельзя сделать определённый тип, потому что в query могут попадать всякие разные
// параметры и мы не можем им определить тип, а то я попытался так сделать и TS говорить про ошибку, т.е. по
// сути можно [key: string... не писать по сути же?
req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO: в query мы можем передать всё что угодно и потом этот объект мапить в любом случае надо, правильно?
    // чтобы типам соответствовало всё дальше в сервисе
    const query = (0, mappers_1.getQueryForUsers)(req.query);
    const result = yield users_query_repository_1.usersQueryRepository.findUsers(query);
    result !== undefined ? res.status(http_status_codes_1.StatusCodes.OK).send(result) : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
});
exports.getUsersController = getUsersController;
