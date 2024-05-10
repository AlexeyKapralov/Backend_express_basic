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
const mongodb_1 = require("mongodb");
const blogsQuery_repository_1 = require("../blogs/blogsQuery.repository");
const db_1 = require("../../db/db");
const mappers_1 = require("../../common/utils/mappers");
exports.postsRepository = {
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield blogsQuery_repository_1.blogsQueryRepository.getBlogByID(body.blogId);
            if (foundBlog) {
                const newPost = {
                    _id: new mongodb_1.ObjectId().toString(),
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                    blogName: foundBlog.name,
                    createdAt: new Date().toISOString()
                };
                const result = yield db_1.db.getCollection().postsCollection.insertOne(newPost);
                return result.acknowledged ? (0, mappers_1.getPostViewModel)(newPost) : undefined;
            }
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            //todo: здесь правильно ли что я обращаюсь к query репозиторию
            const foundBlog = yield blogsQuery_repository_1.blogsQueryRepository.getBlogByID(body.blogId);
            if (foundBlog) {
                const result = yield db_1.db.getCollection().postsCollection.updateOne({
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
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollection().postsCollection.deleteOne({ _id: id });
            return result.deletedCount > 0;
        });
    }
};
