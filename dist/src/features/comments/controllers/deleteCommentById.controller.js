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
exports.deleteCommentByIdController = void 0;
const comments_service_1 = require("../service/comments.service");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const http_status_codes_1 = require("http-status-codes");
const deleteCommentByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comments_service_1.commentsService.deleteComment(req.userId, req.params.commentId);
    switch (result.status) {
        case resultStatus_type_1.ResultStatus.Success:
            res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json();
            break;
        case resultStatus_type_1.ResultStatus.NotFound:
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
            break;
        case resultStatus_type_1.ResultStatus.Forbidden:
            res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json();
            break;
        default:
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json();
    }
});
exports.deleteCommentByIdController = deleteCommentByIdController;
