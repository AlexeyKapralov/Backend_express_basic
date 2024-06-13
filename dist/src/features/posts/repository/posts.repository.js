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
exports.PostsRepository = void 0;
const mongodb_1 = require("mongodb");
const postMappers_1 = require("../mappers/postMappers");
const post_entity_1 = require("../domain/post.entity");
const blogs_repository_1 = require("../../blogs/repository/blogs.repository");
const inversify_1 = require("inversify");
let PostsRepository = class PostsRepository {
    constructor(blogsRepository) {
        this.blogsRepository = blogsRepository;
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_entity_1.PostModel.findOne({
                _id: id
            });
            return result ? result : undefined;
        });
    }
    createPost(body, blogName) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = {
                _id: new mongodb_1.ObjectId(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: blogName,
                createdAt: new Date().toISOString()
            };
            const result = yield post_entity_1.PostModel.create(newPost);
            return !!result ? (0, postMappers_1.getPostViewModel)(newPost) : undefined;
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield this.blogsRepository.getBlogByID(body.blogId);
            if (foundBlog) {
                const result = yield post_entity_1.PostModel.updateOne({
                    _id: id
                }, {
                    $set: {
                        title: body.title,
                        shortDescription: body.shortDescription,
                        content: body.content,
                        blogId: body.blogId,
                        blogName: foundBlog.name
                    }
                });
                return result.matchedCount > 0;
            }
            else
                return false;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield post_entity_1.PostModel.deleteOne({ _id: id });
            return result.deletedCount > 0;
        });
    }
};
exports.PostsRepository = PostsRepository;
exports.PostsRepository = PostsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository])
], PostsRepository);
