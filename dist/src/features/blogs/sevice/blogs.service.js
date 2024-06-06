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
exports.BlogsService = void 0;
const mongodb_1 = require("mongodb");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const blogsMappers_1 = require("../mappers/blogsMappers");
class BlogsService {
    constructor(blogsRepository, postsRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
    }
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = {
                _id: new mongodb_1.ObjectId().toString(),
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const result = yield this.blogsRepository.createBlog(blog);
            return result ? {
                status: resultStatus_type_1.ResultStatus.Success,
                data: (0, blogsMappers_1.getBlogViewModel)(blog)
            } : {
                status: resultStatus_type_1.ResultStatus.NotFound,
                errorMessage: 'blog did not found',
                data: null
            };
        });
    }
    updateBlogByID(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.blogsRepository.updateBlogByID(id, body);
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
    deleteBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.blogsRepository.deleteBlogByID(id))
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
    createPostByBlogId(blogId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBody = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId
            };
            const foundBlog = yield this.blogsRepository.getBlogByID(blogId);
            if (!foundBlog) {
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
            }
            const createdPost = yield this.postsRepository.createPost(newBody, foundBlog.name);
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
}
exports.BlogsService = BlogsService;
