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
exports.postsRepository = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const getPostViewModel = (dbPost) => {
    return {
        id: dbPost.id,
        title: dbPost.title,
        shortDescription: dbPost.shortDescription,
        content: dbPost.content,
        blogId: dbPost.blogId,
        blogName: dbPost.blogName,
        createdAt: dbPost.createdAt
    };
};
exports.postsRepository = {
    getPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query) {
                return (yield db_1.postsCollection
                    .find({
                    title: { $regex: query.title || '' },
                    shortDescription: { $regex: query.shortDescription || '' },
                    content: { $regex: query.content || '' },
                    blogId: { $regex: query.blogId || '' }
                })
                    .project({
                    _id: 0
                })
                    .toArray());
            }
            else {
                return (yield db_1.postsCollection
                    .find({})
                    .project({
                    _id: 0
                })
                    .toArray());
            }
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield db_1.postsCollection.findOne({ id: id }));
            if (result) {
                return getPostViewModel(result);
            }
            else {
                return false;
            }
        });
    },
    createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield db_1.blogsCollection.findOne({ id: data.blogId });
            const newPost = {
                id: String(new mongodb_1.ObjectId()),
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                createdAt: new Date().toISOString(),
                blogId: data.blogId,
                // blogName: 'temp'
                blogName: (foundBlog === null || foundBlog === void 0 ? void 0 : foundBlog.name) || 'unknown name'
            };
            yield db_1.postsCollection.insertOne(newPost);
            return getPostViewModel(newPost);
        });
    },
    updatePost(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield db_1.blogsCollection.findOne({ id: data.blogId });
            const isUpdated = yield db_1.postsCollection.updateOne({ id: id }, {
                $set: {
                    title: data.title,
                    shortDescription: data.shortDescription,
                    content: data.content,
                    blogId: data.blogId,
                    blogName: (foundBlog === null || foundBlog === void 0 ? void 0 : foundBlog.name) || 'unknown name'
                }
            });
            return isUpdated.matchedCount !== 0;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.deleteOne({ id: id });
            if (result.deletedCount > 0) {
                return true;
            }
            else {
                return false;
            }
        });
    }
};
