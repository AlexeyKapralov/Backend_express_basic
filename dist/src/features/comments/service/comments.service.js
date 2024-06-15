"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const users_repository_1 = require("../../users/repository/users.repository");
const comments_repository_1 = require("../repository/comments.repository");
const inversify_1 = require("inversify");
const like_type_1 = require("../../likes/models/like.type");
let CommentsService = class CommentsService {
    constructor(usersRepository, commentsRepository) {
        this.usersRepository = usersRepository;
        this.commentsRepository = commentsRepository;
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
    updateLikeStatus(commentId, likeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsRepository.getCommentById(commentId);
            if (!comment) {
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
            }
            const status = comment.likes.filter(i => i.userId === likeData.userId);
            let currentStatus;
            if (status.length === 0) {
                currentStatus = like_type_1.LikeStatus.None;
            }
            else {
                currentStatus = status[0].status;
            }
            const newStatus = likeData.status;
            let likeIterator = 0;
            let dislikeIterator = 0;
            if (currentStatus === newStatus) {
                likeIterator = 0;
                dislikeIterator = 0;
            }
            if (currentStatus === like_type_1.LikeStatus.Like && newStatus === like_type_1.LikeStatus.Dislike) {
                likeIterator = -1;
                dislikeIterator = 1;
            }
            if (currentStatus === like_type_1.LikeStatus.Dislike && newStatus === like_type_1.LikeStatus.Like) {
                likeIterator = 1;
                dislikeIterator = -1;
            }
            if (currentStatus === like_type_1.LikeStatus.None && newStatus === like_type_1.LikeStatus.Like) {
                likeIterator = 1;
                dislikeIterator = 0;
            }
            if (currentStatus === like_type_1.LikeStatus.Like && newStatus === like_type_1.LikeStatus.None) {
                likeIterator = -1;
                dislikeIterator = 0;
            }
            if (currentStatus === like_type_1.LikeStatus.Dislike && newStatus === like_type_1.LikeStatus.None) {
                likeIterator = 0;
                dislikeIterator = -1;
            }
            if (currentStatus === like_type_1.LikeStatus.None && newStatus === like_type_1.LikeStatus.Dislike) {
                likeIterator = 0;
                dislikeIterator = 1;
            }
            const isUpdatedLikeStatus = yield this.commentsRepository.updateLikeStatus((comment === null || comment === void 0 ? void 0 : comment._id) || '', likeData, likeIterator, dislikeIterator);
            return isUpdatedLikeStatus
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
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(users_repository_1.UsersRepository)),
    __param(1, (0, inversify_1.inject)(comments_repository_1.CommentsRepository)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository, comments_repository_1.CommentsRepository])
], CommentsService);
