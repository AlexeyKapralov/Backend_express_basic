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
exports.CommentsController = void 0;
const resultStatus_type_1 = require("../../common/types/resultStatus.type");
const http_status_codes_1 = require("http-status-codes");
const inversify_1 = require("inversify");
const comments_service_1 = require("./service/comments.service");
const jwtService_1 = require("../../common/adapters/jwtService");
const usersQuery_repository_1 = require("../users/repository/usersQuery.repository");
const commentsQuery_repository_1 = require("./repository/commentsQuery.repository");
let CommentsController = class CommentsController {
    constructor(commentsService, jwtService, usersQueryRepository, commentsQueryRepository) {
        this.commentsService = commentsService;
        this.jwtService = jwtService;
        this.usersQueryRepository = usersQueryRepository;
        this.commentsQueryRepository = commentsQueryRepository;
    }
    updateCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsService.updateComment(req.userId, req.params.commentId, req.body);
            switch (result.status) {
                case resultStatus_type_1.ResultStatus.Success:
                    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json(result.data);
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
    }
    deleteCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsService.deleteComment(req.userId, req.params.commentId);
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
    }
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || null;
            const userId = this.jwtService.getUserIdByToken(token || '');
            let result;
            if (userId) {
                result = yield this.usersQueryRepository.findUserById(userId.toString());
            }
            let comment;
            if (result) {
                comment = yield this.commentsQueryRepository.getCommentById(req.params.commentId, result.id);
            }
            else {
                comment = yield this.commentsQueryRepository.getCommentById(req.params.commentId);
            }
            comment
                ? res.status(http_status_codes_1.StatusCodes.OK).send(comment)
                : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
        });
    }
    likeStatusController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsQueryRepository.getCommentById(req.params.commentId);
            if (!comment) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
                return;
            }
            const likeData = {
                status: req.body.likeStatus,
                userId: req.userId,
                createdAt: new Date()
            };
            const isUpdatedLikeStatus = yield this.commentsService.updateLikeStatus(comment.id, likeData);
            isUpdatedLikeStatus.status === resultStatus_type_1.ResultStatus.Success
                ? res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send()
                : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
        });
    }
};
exports.CommentsController = CommentsController;
exports.CommentsController = CommentsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(comments_service_1.CommentsService)),
    __param(1, (0, inversify_1.inject)(jwtService_1.JwtService)),
    __param(2, (0, inversify_1.inject)(usersQuery_repository_1.UsersQueryRepository)),
    __param(3, (0, inversify_1.inject)(commentsQuery_repository_1.CommentsQueryRepository)),
    __metadata("design:paramtypes", [comments_service_1.CommentsService,
        jwtService_1.JwtService,
        usersQuery_repository_1.UsersQueryRepository,
        commentsQuery_repository_1.CommentsQueryRepository])
], CommentsController);
