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
const db_1 = require("../../../src/db/db");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const commentsManager_test_1 = require("./commentsManager.test");
const supertest_1 = require("supertest");
const app_1 = require("../../../src/app");
const postsManager_test_1 = require("../posts/postsManager.test");
const query_model_1 = require("../../../src/common/types/query.model");
const commentsMappers_1 = require("../../../src/features/comments/mappers/commentsMappers");
const path_1 = require("../../../src/common/config/path");
const comments_entity_1 = require("../../../src/features/comments/domain/comments.entity");
const post_entity_1 = require("../../../src/features/posts/domain/post.entity");
describe('comments e2e tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
        yield postsManager_test_1.postsManagerTest.createPosts(1);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
    it('should get empty array with default pagination', () => __awaiter(void 0, void 0, void 0, function* () {
        const posts = yield post_entity_1.PostModel.find().lean();
        const result = yield (0, supertest_1.agent)(app_1.app)
            .get(`${path_1.PATH.POSTS}/${posts[0]._id}/comments`);
        expect(result.body).toEqual({
            "pagesCount": 0,
            "page": 1,
            "pageSize": 10,
            "totalCount": 0,
            "items": []
        });
    }));
    it('should get comments array with custom pagination', () => __awaiter(void 0, void 0, void 0, function* () {
        const posts = yield post_entity_1.PostModel.find().lean();
        yield commentsManager_test_1.commentsManagerTest.createComments(25, posts[0]._id.toString());
        const query = {
            sortBy: 'content',
            sortDirection: query_model_1.SortDirection.ascending,
            pageNumber: 2,
            pageSize: 4
        };
        const result = yield (0, supertest_1.agent)(app_1.app)
            .get(`${path_1.PATH.POSTS}/${posts[0]._id}/comments`)
            .query(query);
        const comments = yield comments_entity_1.CommentsModel.find()
            .sort({ [query.sortBy]: query.sortDirection })
            .limit(query.pageSize)
            .skip((query.pageNumber - 1) * query.pageSize)
            .lean();
        const commentsCount = yield comments_entity_1.CommentsModel.countDocuments();
        expect(result.body).toEqual({
            "pagesCount": Math.ceil(commentsCount / query.pageSize),
            "page": query.pageNumber,
            "pageSize": query.pageSize,
            "totalCount": commentsCount,
            "items": comments.map(i => (0, commentsMappers_1.getCommentView)(i))
        });
    }));
});
