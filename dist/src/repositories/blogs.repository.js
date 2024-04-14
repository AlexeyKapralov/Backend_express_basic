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
exports.blogsRepository = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const getBlogViewModel = (dbBlog) => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        description: dbBlog.description,
        websiteUrl: dbBlog.websiteUrl,
        createdAt: dbBlog.createdAt,
        isMembership: dbBlog.isMembership
    };
};
exports.blogsRepository = {
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query) {
                return (yield db_1.blogsCollection
                    .find({
                    name: { $regex: query.name || '' },
                    description: { $regex: query.description || '' },
                    websiteUrl: { $regex: query.websiteUrl || '' }
                })
                    .project({
                    _id: 0
                })
                    .toArray());
            }
            else {
                return (yield db_1.blogsCollection
                    .find({})
                    .project({
                    _id: 0
                })
                    .toArray());
            }
        });
    },
    getBlogsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield db_1.blogsCollection.findOne({ id: id }));
            if (result) {
                return getBlogViewModel(result);
            }
            else {
                return false;
            }
        });
    },
    createBlog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: String(new mongodb_1.ObjectId()),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            yield db_1.blogsCollection.insertOne(newBlog);
            return getBlogViewModel(newBlog);
        });
    },
    updateBlog(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield db_1.blogsCollection.findOne({ id: id });
            const isUpdated = yield db_1.blogsCollection.updateOne({ id: id }, {
                $set: {
                    name: data.name || (foundBlog === null || foundBlog === void 0 ? void 0 : foundBlog.name),
                    description: data.description || (foundBlog === null || foundBlog === void 0 ? void 0 : foundBlog.description),
                    websiteUrl: data.websiteUrl || (foundBlog === null || foundBlog === void 0 ? void 0 : foundBlog.websiteUrl)
                }
            });
            return isUpdated.matchedCount !== 0;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({ id: id });
            if (result.deletedCount !== 0) {
                return true;
            }
            else {
                return false;
            }
        });
    }
};
