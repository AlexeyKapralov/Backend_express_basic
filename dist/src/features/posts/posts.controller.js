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
exports.PostsController = void 0;
const inversify_1 = require("inversify");
const resultStatus_type_1 = require("../../common/types/resultStatus.type");
const http_status_codes_1 = require("http-status-codes");
const mappers_1 = require("../../common/utils/mappers");
const jwtService_1 = require("../../common/adapters/jwtService");
const posts_service_1 = require("./service/posts.service");
const usersQuery_repository_1 = require("../users/repository/usersQuery.repository");
const commentsQuery_repository_1 = require("../comments/repository/commentsQuery.repository");
const postsQuery_repository_1 = require("./repository/postsQuery.repository");
let PostsController = class PostsController {
    constructor(postsService, jwtService, usersQueryRepository, commentsQueryRepository, postsQueryRepository) {
        this.postsService = postsService;
        this.jwtService = jwtService;
        this.usersQueryRepository = usersQueryRepository;
        this.commentsQueryRepository = commentsQueryRepository;
        this.postsQueryRepository = postsQueryRepository;
    }
    createCommentForPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService.createComment(req.userId, req.params.postId, req.body);
            result.status === resultStatus_type_1.ResultStatus.Success
                ? res.status(http_status_codes_1.StatusCodes.CREATED).json(result.data)
                : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService.createPost(req.body);
            result.status === resultStatus_type_1.ResultStatus.Success ? res.status(http_status_codes_1.StatusCodes.CREATED).json(result.data) : res.sendStatus(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield this.postsService.deletePost(req.params.id);
            isDeleted ? res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT) : res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = (0, mappers_1.getQueryParams)(req.query);
            const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || null;
            const userId = this.jwtService.getUserIdByToken(token || '');
            let result;
            if (userId) {
                result = yield this.usersQueryRepository.findUserById(userId.toString());
            }
            let comments;
            if (result) {
                comments = yield this.commentsQueryRepository.getComments(req.params.id, query, userId);
            }
            else {
                comments = yield this.commentsQueryRepository.getComments(req.params.id, query);
            }
            comments
                ? res.status(http_status_codes_1.StatusCodes.OK).send(comments)
                : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsQueryRepository.getPostById(req.params.id, req.userId);
            result ? res.status(http_status_codes_1.StatusCodes.OK).json(result) : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, mappers_1.getQueryParams)(req.query);
            const result = yield this.postsQueryRepository.getPosts(query, req.userId);
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
        });
    }
    updatePostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService.updatePost(req.params.id, req.body);
            result ? res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json() : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
        });
    }
};
exports.PostsController = PostsController;
exports.PostsController = PostsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(posts_service_1.PostsService)),
    __param(1, (0, inversify_1.inject)(jwtService_1.JwtService)),
    __param(2, (0, inversify_1.inject)(usersQuery_repository_1.UsersQueryRepository)),
    __param(3, (0, inversify_1.inject)(commentsQuery_repository_1.CommentsQueryRepository)),
    __param(4, (0, inversify_1.inject)(postsQuery_repository_1.PostsQueryRepository)),
    __metadata("design:paramtypes", [posts_service_1.PostsService,
        jwtService_1.JwtService,
        usersQuery_repository_1.UsersQueryRepository,
        commentsQuery_repository_1.CommentsQueryRepository,
        postsQuery_repository_1.PostsQueryRepository])
], PostsController);
