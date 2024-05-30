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
const getCommentByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield commentsQuery_repository_1.commentsQueryRepository.getCommentById(req.params.commentId);
    comment
        ? res.status(http_status_codes_1.StatusCodes.OK).json(comment)
        : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
});
exports.getCommentByIdController = getCommentByIdController;
