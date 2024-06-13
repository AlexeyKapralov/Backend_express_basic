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
const db_1 = require("../../../src/db/db");
const authManager_test_1 = require("../../e2e/auth/authManager.test");
const blogsManager_test_1 = require("../../e2e/blogs/blogsManager.test");
const postsManager_test_1 = require("../../e2e/posts/postsManager.test");
const jwtService_1 = require("../../../src/common/adapters/jwtService");
const resultStatus_type_1 = require("../../../src/common/types/resultStatus.type");
const comments_entity_1 = require("../../../src/features/comments/domain/comments.entity");
const ioc_1 = require("../../../src/ioc");
const posts_service_1 = require("../../../src/features/posts/service/posts.service");
const comments_service_1 = require("../../../src/features/comments/service/comments.service");
describe('comments integration tests', () => {
    let tokens;
    let blog;
    let post;
    const jwtService = ioc_1.container.resolve(jwtService_1.JwtService);
    const postsService = ioc_1.container.resolve(posts_service_1.PostsService);
    const commentsService = ioc_1.container.resolve(comments_service_1.CommentsService);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
        tokens = yield authManager_test_1.authManagerTest.createAndAuthUser();
        blog = yield blogsManager_test_1.blogsManagerTest.createBlog('default', tokens.accessToken ? tokens.accessToken : ' ');
        post = yield postsManager_test_1.postsManagerTest.createPost('default', tokens.accessToken ? tokens.accessToken : ' ');
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
        const userId = jwtService.getUserIdByToken(tokens.accessToken);
        const result = yield postsService.createComment(userId, post.id, body);
        expect(result).toEqual({
            status: resultStatus_type_1.ResultStatus.Success,
            data: expect.objectContaining({
                id: expect.any(String),
                content: body.content,
                createdAt: expect.stringMatching((/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)),
                commentatorInfo: expect.objectContaining({
                    userId: userId,
                    userLogin: expect.any(String),
                }),
                likesInfo: expect.objectContaining({
                    likesCount: expect.any(Number),
                    dislikesCount: expect.any(Number),
                    myStatus: expect.any(String)
                })
            })
        });
    }));
    it(`shouldn't update comment with another user`, () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            content: 'aaabbb'
        };
        const userId = jwtService.getUserIdByToken(tokens.accessToken);
        const result = yield postsService.createComment(userId, post.id, body);
        const newBody = {
            content: 'ccc'
        };
        let isUpdated;
        if (result.data !== null) {
            isUpdated = yield commentsService.updateComment('userId!', result.data.id, newBody);
        }
        expect(isUpdated.status).toBe(resultStatus_type_1.ResultStatus.NotFound);
    }));
    it('should update comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            content: 'aaabbb'
        };
        const userId = jwtService.getUserIdByToken(tokens.accessToken);
        const result = yield postsService.createComment(userId, post.id, body);
        const newBody = {
            content: 'ccc'
        };
        if (result.data !== null) {
            yield commentsService.updateComment(userId, result.data.id, newBody);
        }
        const updatedComment = yield comments_entity_1.CommentsModel.findOne({ _id: result.data.id });
        expect(updatedComment.content).toBe(newBody.content);
    }));
    it(`shouldn't delete comment with another userId`, () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            content: 'aaabbb'
        };
        const userId = jwtService.getUserIdByToken(tokens.accessToken);
        const result = yield postsService.createComment(userId, post.id, body);
        let isDeleted;
        if (result.data !== null) {
            isDeleted = yield commentsService.deleteComment('userId!', result.data.id);
        }
        expect(isDeleted.status).toBe(resultStatus_type_1.ResultStatus.NotFound);
    }));
    it('should delete comment', () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            content: 'aaabbb'
        };
        const userId = jwtService.getUserIdByToken(tokens.accessToken);
        const result = yield postsService.createComment(userId, post.id, body);
        if (result.data !== null) {
            yield commentsService.deleteComment(userId, result.data.id);
        }
        const isDeleted = yield comments_entity_1.CommentsModel.findOne({ _id: result.data.id });
        expect(isDeleted).toBe(null);
    }));
});
