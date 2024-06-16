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
exports.PostsService = void 0;
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const commentsMappers_1 = require("../../comments/mappers/commentsMappers");
const blogs_repository_1 = require("../../blogs/repository/blogs.repository");
const posts_repository_1 = require("../repository/posts.repository");
const users_repository_1 = require("../../users/repository/users.repository");
const comments_repository_1 = require("../../comments/repository/comments.repository");
const inversify_1 = require("inversify");
let PostsService = class PostsService {
    constructor(blogsRepository, postsRepository, usersRepository, commentsRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.usersRepository = usersRepository;
        this.commentsRepository = commentsRepository;
    }
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield this.blogsRepository.getBlogByID(body.blogId);
            if (!foundBlog) {
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
            }
            const createdPost = yield this.postsRepository.createPost(body, foundBlog.name);
            return createdPost
                ? {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: createdPost
                }
                : {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.postsRepository.updatePost(id, body))
                ? {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: null
                }
                : {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.postsRepository.deletePost(id))
                ? {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: null
                }
                : {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
        });
    }
    createComment(userId, postId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsRepository.getPostById(postId);
            const user = yield this.usersRepository.findUserById(userId);
            if (post && user) {
                const res = yield this.commentsRepository.createComment(user, post, body);
                return res
                    ? {
                        status: resultStatus_type_1.ResultStatus.Success,
                        data: (0, commentsMappers_1.getCommentView)(res)
                    }
                    : {
                        status: resultStatus_type_1.ResultStatus.BadRequest,
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
    likePost(postId, userId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLiked = yield this.postsRepository.likePost(postId, userId, likeStatus);
            return isLiked
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
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __param(1, (0, inversify_1.inject)(posts_repository_1.PostsRepository)),
    __param(2, (0, inversify_1.inject)(users_repository_1.UsersRepository)),
    __param(3, (0, inversify_1.inject)(comments_repository_1.CommentsRepository)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        posts_repository_1.PostsRepository,
        users_repository_1.UsersRepository,
        comments_repository_1.CommentsRepository])
], PostsService);
