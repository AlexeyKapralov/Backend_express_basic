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
exports.PostsService = void 0;
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const commentsMappers_1 = require("../../comments/mappers/commentsMappers");
class PostsService {
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
            const result = yield this.postsRepository.createPost(body, foundBlog.name);
            return result
                ? {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: result
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
}
exports.PostsService = PostsService;
