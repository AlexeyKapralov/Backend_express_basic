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
const like_type_1 = require("../../likes/models/like.type");
const likesForPosts_entity_1 = require("../../likes/domain/likesForPosts.entity");
const user_entity_1 = require("../../users/domain/user.entity");
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
                createdAt: new Date().toISOString(),
                dislikesCount: 0,
                likesCount: 0
            };
            const result = yield post_entity_1.PostModel.create(newPost);
            return !!result ? (0, postMappers_1.getPostViewModel)(newPost, [], like_type_1.LikeStatus.None) : undefined;
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
    likePost(postId, userId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            //найти юзера
            //найти пост
            let user = null;
            let post = null;
            try {
                user = yield user_entity_1.UsersModel.findOne({ _id: userId });
                post = yield post_entity_1.PostModel.findOne({ _id: postId });
            }
            catch (_a) {
                return false;
            }
            //проверка есть ли он
            if (!post || !user) {
                return false;
            }
            //есть ли у юзера лайк/дизлайк
            //нет - создать, да изменить статус
            let like = yield likesForPosts_entity_1.LikesPostsModel.findOne({ postId: postId, userId: userId });
            let isNewLike = false;
            if (!like) {
                like = yield likesForPosts_entity_1.LikesPostsModel.initLikePost(like_type_1.LikeStatus.None, userId, postId, user.login);
                isNewLike = true;
            }
            //todo возможно стоит убрать в likePostsEntity
            //изменить в постах колво лойков дизлайков
            if (likeStatus === like.description) {
                return true;
            }
            switch (true) {
                case (likeStatus === like_type_1.LikeStatus.Like && like.description === like_type_1.LikeStatus.Dislike):
                    yield like.setDescription(likeStatus);
                    yield post.addCountLikes(1);
                    yield post.addCountDislikes(-1);
                    break;
                case (likeStatus === like_type_1.LikeStatus.Like && like.description === like_type_1.LikeStatus.None):
                    yield like.setDescription(likeStatus);
                    yield post.addCountLikes(1);
                    // post.addCountDislikes(0)
                    break;
                case (likeStatus === like_type_1.LikeStatus.Dislike && like.description === like_type_1.LikeStatus.Like):
                    yield like.setDescription(likeStatus);
                    yield post.addCountLikes(-1);
                    yield post.addCountDislikes(1);
                    break;
                case (likeStatus === like_type_1.LikeStatus.Dislike && like.description === like_type_1.LikeStatus.None):
                    yield like.setDescription(likeStatus);
                    // post.addCountLikes(0)
                    yield post.addCountDislikes(1);
                    break;
                case (likeStatus === like_type_1.LikeStatus.None && like.description === like_type_1.LikeStatus.Like):
                    yield like.setDescription(likeStatus);
                    yield post.addCountLikes(-1);
                    // post.addCountDislikes(0)
                    break;
                case (likeStatus === like_type_1.LikeStatus.None && like.description === like_type_1.LikeStatus.Dislike):
                    yield like.setDescription(likeStatus);
                    // post.addCountLikes(0)
                    yield post.addCountDislikes(-1);
                    break;
                default:
                    break;
            }
            return true;
        });
    }
};
exports.PostsRepository = PostsRepository;
exports.PostsRepository = PostsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogs_repository_1.BlogsRepository)),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository])
], PostsRepository);
