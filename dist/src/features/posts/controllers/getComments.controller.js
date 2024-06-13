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
exports.getCommentsController = void 0;
const mappers_1 = require("../../../common/utils/mappers");
const http_status_codes_1 = require("http-status-codes");
const jwtService_1 = require("../../../common/adapters/jwtService");
const getCommentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = (0, mappers_1.getQueryParams)(req.query);
    const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || null;
    const userId = jwtService_1.JwtService.getUserIdByToken(token || '');
    let result;
    if (userId) {
        result = yield usersQueryRepository.findUserById(userId.toString());
    }
    let comments;
    if (result) {
        comments = yield commentsQueryRepository.getComments(req.params.id, query, userId);
    }
    else {
        comments = yield commentsQueryRepository.getComments(req.params.id, query);
    }
    comments
        ? res.status(http_status_codes_1.StatusCodes.OK).send(comments)
        : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
});
exports.getCommentsController = getCommentsController;
