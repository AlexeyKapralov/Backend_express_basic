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
const blogs_entity_1 = require("../domain/blogs.entity");
exports.blogsRepository = {
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_entity_1.BlogModel.create(body);
            return !!result;
        });
    },
    updateBlogByID(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_entity_1.BlogModel.updateOne({
                _id: id
            }, {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl
                }
            });
            return result.modifiedCount > 0;
        });
    },
    deleteBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_entity_1.BlogModel.deleteOne({ _id: id });
            return result.deletedCount > 0;
        });
    },
    getBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_entity_1.BlogModel.findOne({
                _id: id
            });
            return result ? result : undefined;
        });
    },
};
