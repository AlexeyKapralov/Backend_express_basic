"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.PostsQueryRepository = void 0;
const query_model_1 = require("../../../common/types/query.model");
const postMappers_1 = require("../mappers/postMappers");
const post_entity_1 = require("../domain/post.entity");
const inversify_1 = require("inversify");
const likesForPosts_entity_1 = require("../../likes/domain/likesForPosts.entity");
const like_type_1 = require("../../likes/models/like.type");
let PostsQueryRepository = class PostsQueryRepository {
    //todo глянуть это еще раз свежим взглядом
    getPosts(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield post_entity_1.PostModel
                .find()
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .sort({ [query.sortBy]: query.sortDirection })
                .lean();
            // const posts: WithId<IPostDbModel>[] = await PostModel.aggregate([
            //     // { $match: { type: 'product' } },
            //     {$sort: {[query.sortBy!]: query.sortDirection!}},
            //     {$skip: (query.pageNumber! - 1) * query.pageSize!},
            //     {$limit: query.pageSize!},
            //     {
            //         $lookup: {
            //             from: 'likesPosts',
            //             localField: '_id',
            //             foreignField: 'parentId',
            //             as: 'extendedLikesInfo'
            //         }
            //     }
            // ])
            const newPosts = [];
            yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                const newestLikes = yield likesForPosts_entity_1.LikesPostsModel
                    .find({ postId: post._id, description: like_type_1.LikeStatus.Like })
                    .sort({ addedAt: query_model_1.SortDirection.descending })
                    .limit(3)
                    .lean();
                let currentUserLike = null;
                if (userId) {
                    currentUserLike = yield likesForPosts_entity_1.LikesPostsModel
                        .findOne({ postId: post._id, userId: userId })
                        .lean();
                }
                const currentUserLikeStatus = currentUserLike ? currentUserLike.description : like_type_1.LikeStatus.None;
                const newPost = (0, postMappers_1.getPostViewModel)(post, newestLikes, currentUserLikeStatus);
                newPosts.push(newPost);
            })));
            newPosts.sort(function (a, b) {
                if (a.createdAt < b.createdAt) {
                    return 1;
                }
                if (a.createdAt > b.createdAt) {
                    return -1;
                }
                return 0;
            });
            const countDocs = yield post_entity_1.PostModel.countDocuments();
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: newPosts
            };
        });
    }
    getPostById(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userPostLikeStatus = like_type_1.LikeStatus.None;
            if (userId !== null) {
                const userPostLike = yield likesForPosts_entity_1.LikesPostsModel.findOne({ userId, postId }).lean();
                if (userPostLike) {
                    userPostLikeStatus = userPostLike.description;
                }
            }
            const newestLikes = yield likesForPosts_entity_1.LikesPostsModel
                .find({ _id: postId, description: like_type_1.LikeStatus.Like })
                .sort({ addedAt: query_model_1.SortDirection.descending })
                .limit(3)
                .lean();
            const result = yield post_entity_1.PostModel.findOne({
                _id: postId
            });
            return result ? (0, postMappers_1.getPostViewModel)(result, newestLikes, userPostLikeStatus) : undefined;
        });
    }
};
exports.PostsQueryRepository = PostsQueryRepository;
exports.PostsQueryRepository = PostsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], PostsQueryRepository);
