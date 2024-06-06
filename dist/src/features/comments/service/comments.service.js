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
exports.CommentsService = void 0;
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
class CommentsService {
    constructor(usersRepository, commentsRepository) {
        this.usersRepository = usersRepository;
        this.commentsRepository = commentsRepository;
    }
    updateComment(userId, commentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserById(userId);
            const comment = yield this.commentsRepository.getCommentById(commentId);
            if (!comment || !user) {
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
            }
            if (comment.commentatorInfo.userId !== user._id) {
                return {
                    status: resultStatus_type_1.ResultStatus.Forbidden,
                    data: null
                };
            }
            const result = yield this.commentsRepository.updateComment(commentId, data);
            if (result) {
                return {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: null
                };
            }
            else {
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
            }
        });
    }
    deleteComment(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserById(userId);
            const comment = yield this.commentsRepository.getCommentById(commentId);
            if (!comment || !user) {
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
            }
            if (comment.commentatorInfo.userId !== user._id) {
                return {
                    status: resultStatus_type_1.ResultStatus.Forbidden,
                    data: null
                };
            }
            const result = yield this.commentsRepository.deleteComment(commentId);
            return result
                ? {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: null
                }
                : {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
        });
    }
}
exports.CommentsService = CommentsService;
