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
exports.postRepository = void 0;
const db_1 = require("../db/db");
exports.postRepository = {
    countPosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return id
                ? yield db_1.postsCollection.countDocuments({ blogId: id })
                : yield db_1.postsCollection.countDocuments();
        });
    },
    getPostsByBlogId(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection
                .find({ blogId: id })
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();
        });
    },
    createPostForBlog(post) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.insertOne(post);
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.findOne({
                _id: id
            });
        });
    },
    findAllPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection
                .find({})
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();
        });
    },
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.insertOne(post);
            return result.acknowledged ? true : false;
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogsCollection.findOne({ _id: body.blogId });
            if (blog === null) {
                return false;
            }
            else {
                const result = yield db_1.postsCollection.updateOne({ _id: id }, {
                    $set: {
                        title: body.title,
                        shortDescription: body.shortDescription,
                        content: body.content,
                        blogId: body.blogId,
                        blogName: blog.name
                    }
                });
                return result.matchedCount > 0 ? true : false;
            }
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.deleteOne({ _id: id });
            return result.deletedCount > 0 ? true : false;
        });
    }
};
