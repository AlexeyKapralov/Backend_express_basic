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
exports.BlogsService = void 0;
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const blogsMappers_1 = require("../mappers/blogsMappers");
const blogs_repository_1 = require("../repository/blogs.repository");
const posts_repository_1 = require("../../posts/repository/posts.repository");
const inversify_1 = require("inversify");
let BlogsService = class BlogsService {
    constructor(blogsRepository, postsRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
    }
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = yield this.blogsRepository.createBlog(body);
            return createdBlog ? {
                status: resultStatus_type_1.ResultStatus.Success,
                data: (0, blogsMappers_1.getBlogViewModel)(createdBlog)
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
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __param(1, (0, inversify_1.inject)(posts_repository_1.PostsRepository)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        posts_repository_1.PostsRepository])
], BlogsService);
