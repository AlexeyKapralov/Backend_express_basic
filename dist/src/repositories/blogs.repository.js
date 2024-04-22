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
exports.blogsRepository = {
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.findOne({
                _id: id
            });
        });
    },
    countBlogs(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return filter
                ? yield db_1.blogsCollection.countDocuments({
                    name: { $regex: filter, $options: 'i' }
                })
                : yield db_1.blogsCollection.countDocuments();
        });
    },
    createBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.insertOne(blog);
            return result.acknowledged ? true : false;
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = (yield db_1.blogsCollection.findOne({ _id: id }));
            const result = yield db_1.blogsCollection.updateOne({
                _id: id
            }, {
                $set: {
                    name: body.name ? body.name : foundBlog.name,
                    description: body.description
                        ? body.description
                        : foundBlog.description,
                    websiteUrl: body.websiteUrl ? body.websiteUrl : foundBlog.websiteUrl
                }
            });
            return result.modifiedCount > 0 ? true : false;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({
                _id: id
            });
            return result.deletedCount > 0 ? true : false;
        });
    }
};
