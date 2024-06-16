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
exports.blogsQueryRepository = void 0;
const query_model_1 = require("../../../common/types/query.model");
const blogsMappers_1 = require("../mappers/blogsMappers");
const postMappers_1 = require("../../posts/mappers/postMappers");
const blogs_entity_1 = require("../domain/blogs.entity");
const post_entity_1 = require("../../posts/domain/post.entity");
const likesForPosts_entity_1 = require("../../likes/domain/likesForPosts.entity");
const like_type_1 = require("../../likes/models/like.type");
const likePosts_mapper_1 = require("../../likes/mappers/likePosts.mapper");
exports.blogsQueryRepository = {
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const newQuery = { name: { $regex: (_a = query.searchNameTerm) !== null && _a !== void 0 ? _a : '', $options: 'i' } };
            const res = yield blogs_entity_1.BlogModel
                .find(newQuery)
                .sort({ [query.sortBy]: query.sortDirection })
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .lean();
            const countDocs = yield blogs_entity_1.BlogModel
                .countDocuments(newQuery);
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: res.map(blogsMappers_1.getBlogViewModel)
            };
        });
    },
    getBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_entity_1.BlogModel.findOne({
                _id: id
            });
            return result ? (0, blogsMappers_1.getBlogViewModel)(result) : undefined;
        });
    },
    getPostsByBlogID(id, query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield post_entity_1.PostModel
                .find({ blogId: id })
                .sort({ [query.sortBy]: query.sortDirection })
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .lean();
            const countDocs = yield post_entity_1.PostModel
                .countDocuments({ blogId: id });
            //todo как-будто бы эту логику можно вынести в отдельный блок, т.к. она много где повторяется
            let newPosts = [];
            yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                const newestLikes = yield likesForPosts_entity_1.LikesPostsModel
                    .find({ postId: post._id, description: like_type_1.LikeStatus.Like })
                    .sort({ addedAt: query_model_1.SortDirection.descending })
                    .limit(3)
                    .lean();
                const newestLikesMapped = newestLikes.map(likePosts_mapper_1.likePostsMapper);
                let currentUserLike = null;
                if (userId) {
                    currentUserLike = yield likesForPosts_entity_1.LikesPostsModel
                        .findOne({ postId: post._id.toString(), userId: userId })
                        .lean();
                }
                const currentUserLikeStatus = currentUserLike ? currentUserLike.description : like_type_1.LikeStatus.None;
                const newPost = (0, postMappers_1.getPostViewModel)(post, newestLikesMapped, currentUserLikeStatus);
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
            if (posts.length > 0) {
                return {
                    pagesCount: Math.ceil(countDocs / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount: countDocs,
                    items: newPosts
                };
            }
            else {
                return undefined;
            }
        });
    }
};
