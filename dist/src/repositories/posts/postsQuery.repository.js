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
exports.postsQueryRepository = void 0;
const db_1 = require("../../db/db");
const mappers_1 = require("../../common/utils/mappers");
exports.postsQueryRepository = {
    getPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_1.db.getCollection().postsCollection
                .find()
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .sort(query.sortBy, query.sortDirection)
                .toArray();
            const countDocs = yield db_1.db.getCollection().postsCollection.countDocuments();
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: posts.map(mappers_1.getPostViewModel)
            };
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollection().postsCollection.findOne({
                _id: id
            });
            return result ? (0, mappers_1.getPostViewModel)(result) : undefined;
        });
    }
};
