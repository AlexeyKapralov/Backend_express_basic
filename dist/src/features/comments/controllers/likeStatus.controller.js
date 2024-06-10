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
exports.likeStatusController = void 0;
const commentsQuery_repository_1 = require("../repository/commentsQuery.repository");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const http_status_codes_1 = require("http-status-codes");
const commentsCompositionRoot_1 = require("../commentsCompositionRoot");
const likeStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield commentsQuery_repository_1.commentsQueryRepository.getCommentById(req.params.commentId);
    if (!comment) {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
        return;
    }
    const likeData = {
        status: req.body.likeStatus,
        userId: req.userId,
        createdAt: new Date()
    };
    const isUpdatedLikeStatus = yield commentsCompositionRoot_1.commentsService.updateLikeStatus(comment.id, likeData);
    isUpdatedLikeStatus.status === resultStatus_type_1.ResultStatus.Success
        ? res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send()
        : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
});
exports.likeStatusController = likeStatusController;
