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
exports.BlogsRepository = void 0;
const blogs_entity_1 = require("../domain/blogs.entity");
const inversify_1 = require("inversify");
let BlogsRepository = class BlogsRepository {
    // constructor(@inject(BlogModel) protected blogModel: ) {
    // }
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_entity_1.BlogModel.initUser(body);
        });
    }
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
    }
    deleteBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_entity_1.BlogModel.deleteOne({ _id: id });
            return result.deletedCount > 0;
        });
    }
    getBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogs_entity_1.BlogModel.findOne({
                _id: id
            });
            return result ? result : undefined;
        });
    }
};
exports.BlogsRepository = BlogsRepository;
exports.BlogsRepository = BlogsRepository = __decorate([
    (0, inversify_1.injectable)()
], BlogsRepository);
