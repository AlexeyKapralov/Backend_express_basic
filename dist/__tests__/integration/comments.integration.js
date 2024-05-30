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
const mongodb_memory_server_1 = require("mongodb-memory-server");
const db_1 = require("../../src/db/db");
const posts_service_1 = require("../../src/service/posts.service");
const authManager_test_1 = require("../e2e/auth/authManager.test");
const blogsManager_test_1 = require("../e2e/blogs/blogsManager.test");
const postsManager_test_1 = require("../e2e/posts/postsManager.test");
const jwt_service_1 = require("../../src/common/adapters/jwt.service");
const resultStatus_type_1 = require("../../src/common/types/resultStatus.type");
const comments_service_1 = require("../../src/service/comments.service");
describe('repository integration tests', () => {
    let accessToken;
    let blog;
    let post;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
        accessToken = yield authManager_test_1.authManagerTest.createAndAuthUser();
        blog = yield blogsManager_test_1.blogsManagerTest.createBlog('default', accessToken ? accessToken : ' ');
        post = yield postsManager_test_1.postsManagerTest.createPost('default', accessToken ? accessToken : ' ');
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
    it('should create comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            content: 'aaaa'
        };
        const userId = jwt_service_1.jwtService.getUserIdByToken(accessToken);
        const result = yield posts_service_1.postsService.createComment(userId, post.id, body);
        expect(result).toEqual({
            status: resultStatus_type_1.ResultStatus.Success,
            data: expect.objectContaining({
                id: expect.any(String),
                content: body.content,
                createdAt: expect.stringMatching((/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)),
                commentatorInfo: expect.objectContaining({
                    userId: userId,
                    userLogin: expect.any(String),
                })
            })
        });
    }));
    it(`shouldn't update comment with another user`, () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            content: 'aaabbb'
        };
        const userId = jwt_service_1.jwtService.getUserIdByToken(accessToken);
        const result = yield posts_service_1.postsService.createComment(userId, post.id, body);
        const newBody = {
            content: 'ccc'
        };
        let isUpdated;
        if (result.data !== null) {
            isUpdated = yield comments_service_1.commentsService.updateComment('userId!', result.data.id, newBody);
        }
        expect(isUpdated.status).toBe(resultStatus_type_1.ResultStatus.NotFound);
    }));
    it('should update comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            content: 'aaabbb'
        };
        const userId = jwt_service_1.jwtService.getUserIdByToken(accessToken);
        const result = yield posts_service_1.postsService.createComment(userId, post.id, body);
        const newBody = {
            content: 'ccc'
        };
        if (result.data !== null) {
            yield comments_service_1.commentsService.updateComment(userId, result.data.id, newBody);
        }
        const updatedComment = yield db_1.db.getCollection().commentsCollection.findOne({ _id: result.data.id });
        expect(updatedComment.content).toBe(newBody.content);
    }));
    it(`shouldn't delete comment with another userId`, () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            content: 'aaabbb'
        };
        const userId = jwt_service_1.jwtService.getUserIdByToken(accessToken);
        const result = yield posts_service_1.postsService.createComment(userId, post.id, body);
        let isDeleted;
        if (result.data !== null) {
            isDeleted = yield comments_service_1.commentsService.deleteComment('userId!', result.data.id);
        }
        expect(isDeleted.status).toBe(resultStatus_type_1.ResultStatus.NotFound);
    }));
    it('should delete comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            content: 'aaabbb'
        };
        const userId = jwt_service_1.jwtService.getUserIdByToken(accessToken);
        const result = yield posts_service_1.postsService.createComment(userId, post.id, body);
        if (result.data !== null) {
            yield comments_service_1.commentsService.deleteComment(userId, result.data.id);
        }
        const isDeleted = yield db_1.db.getCollection().commentsCollection.findOne({ _id: result.data.id });
        expect(isDeleted).toBe(null);
    }));
});
