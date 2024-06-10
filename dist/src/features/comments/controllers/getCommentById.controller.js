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
exports.getCommentByIdController = void 0;
const http_status_codes_1 = require("http-status-codes");
const commentsQuery_repository_1 = require("../repository/commentsQuery.repository");
const jwt_service_1 = require("../../../common/adapters/jwt.service");
const usersQuery_repository_1 = require("../../users/repository/usersQuery.repository");
const getCommentByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || null;
    const userId = jwt_service_1.jwtService.getUserIdByToken(token || '');
    let result;
    if (userId) {
        result = yield usersQuery_repository_1.usersQueryRepository.findUserById(userId.toString());
    }
    let comment;
    if (result) {
        comment = yield commentsQuery_repository_1.commentsQueryRepository.getCommentById(req.params.commentId, result.id);
    }
    else {
        comment = yield commentsQuery_repository_1.commentsQueryRepository.getCommentById(req.params.commentId);
    }
    comment
        ? res.status(http_status_codes_1.StatusCodes.OK).send(comment)
        : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
});
exports.getCommentByIdController = getCommentByIdController;
