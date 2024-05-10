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
exports.postsService = void 0;
const posts_repository_1 = require("../repositories/posts/posts.repository");
const postsQuery_repository_1 = require("../repositories/posts/postsQuery.repository");
const comments_repository_1 = require("../repositories/comments/comments.repository");
const resultStatus_type_1 = require("../common/types/resultStatus.type");
const usersQuery_repository_1 = require("../repositories/users/usersQuery.repository");
const mappers_1 = require("../common/utils/mappers");
exports.postsService = {
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield posts_repository_1.postsRepository.createPost(body);
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
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield posts_repository_1.postsRepository.updatePost(id, body))
                ? {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: null
                }
                : {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield posts_repository_1.postsRepository.deletePost(id))
                ? {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: null
                }
                : {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
        });
    },
    createComment(userId, postId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postsQuery_repository_1.postsQueryRepository.getPostById(postId);
            const user = yield usersQuery_repository_1.usersQueryRepository.findUserById(userId);
            if (post && user) {
                const res = yield comments_repository_1.commentsRepository.createComment(user, post, body);
                return res
                    ? {
                        status: resultStatus_type_1.ResultStatus.Success,
                        data: (0, mappers_1.getCommentView)(res)
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
};
