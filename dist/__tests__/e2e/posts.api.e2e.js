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
const app_1 = require("../../src/app");
const settings_1 = require("../../src/settings");
const utils_1 = require("../../src/utils/utils");
const blogsTestManager_1 = require("../utils/blogsTestManager");
const postsTestManager_1 = require("../utils/postsTestManager");
const request = require('supertest');
describe('', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield request(app_1.app).delete(`${settings_1.SETTINGS.PATH.TESTS}`);
    }));
    it('should get posts', () => __awaiter(void 0, void 0, void 0, function* () {
        yield request(app_1.app)
            .get(`${settings_1.SETTINGS.PATH.POSTS}`)
            .expect(utils_1.HTTP_STATUSES.OK_200)
            .expect([]);
    }));
    let createdBlogGlobal;
    it(`should create blog`, () => __awaiter(void 0, void 0, void 0, function* () {
        const newBlog = {
            name: "123",
            description: "string",
            websiteUrl: "https://google.com"
        };
        const { createdBlog } = yield blogsTestManager_1.blogsTestManager.createBlog(newBlog, settings_1.SETTINGS.ADMIN_AUTH);
        createdBlogGlobal = createdBlog;
    }));
    let createdPostGlobal;
    it(`shouldn't create post with incorrect blogId`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: "id_blo1"
        };
        const { response } = yield postsTestManager_1.postsTestManager.createPost(data, settings_1.SETTINGS.ADMIN_AUTH, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "blogId"
                }
            ]
        });
        yield request(app_1.app)
            .get(settings_1.SETTINGS.PATH.POSTS)
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    }));
    it(`shouldn't create post with incorrect data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: "stringasdasdasdasdasstringasdasdasdasdas",
            shortDescription: "",
            content: '',
            blogId: 'asdasd'
        };
        const { response } = yield postsTestManager_1.postsTestManager.createPost(data, settings_1.SETTINGS.ADMIN_AUTH, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        expect(response.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "title"
                },
                {
                    message: expect.any(String),
                    field: "shortDescription"
                },
                {
                    message: expect.any(String),
                    field: "content"
                },
                {
                    message: expect.any(String),
                    field: "blogId"
                }
            ]
        });
    }));
    it(`should create post with correct blogId`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: createdBlogGlobal.id
        };
        const { createdPost } = yield postsTestManager_1.postsTestManager.createPost(data, settings_1.SETTINGS.ADMIN_AUTH);
        if (createdPost) {
            createdPostGlobal = createdPost;
        }
        else {
            expect(createdPost).toEqual(undefined);
        }
        yield request(app_1.app)
            .get(settings_1.SETTINGS.PATH.POSTS)
            .expect(utils_1.HTTP_STATUSES.OK_200, [createdPostGlobal]);
    }));
});
