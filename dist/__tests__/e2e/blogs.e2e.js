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
const supertest_1 = require("supertest");
const app_1 = require("../../src/app");
const blogsTestManager_1 = require("../utils/blogsTestManager");
const settings_1 = require("../../src/settings");
const http_status_codes_1 = require("http-status-codes");
const blogs_repository_1 = require("../../src/repositories/blogs.repository");
describe('', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app).delete(settings_1.SETTINGS.PATH.TEST_DELETE);
    }));
    it('should get version', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app)
            .get('/')
            .expect('All is running');
    }));
    it('should get blogs', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app)
            .get(settings_1.SETTINGS.PATH.BLOGS)
            .expect(200)
            .expect([]);
    }));
    it('shouldn\'t create blog', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "stringstringstring",
            description: "stringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstrin",
            websiteUrl: "https://MtQPC9zxc"
        };
        const { response } = yield blogsTestManager_1.blogsTestManager.createBlog(data, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.BAD_REQUEST);
        // return expect(response.status).toBe(StatusCodes.BAD_REQUEST)
        return expect(response.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "name"
                },
                {
                    message: expect.any(String),
                    field: "description"
                },
                {
                    message: expect.any(String),
                    field: "websiteUrl"
                }
            ]
        });
    }));
    let blogGlobalId;
    it('should create blog and update', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "string",
            description: "string",
            websiteUrl: "https://MtQPC9.ru"
        };
        const { response, createdBlog } = yield blogsTestManager_1.blogsTestManager.createBlog(data, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.CREATED);
        expect(response.status).toBe(http_status_codes_1.StatusCodes.CREATED);
        const result = yield blogs_repository_1.blogsRepository.getBlogs();
        expect(result).toEqual([createdBlog]);
        const receivedBlogById = yield blogsTestManager_1.blogsTestManager.getBlogById(createdBlog.id);
        expect(receivedBlogById.body).toEqual(createdBlog);
        const dataForUpdate = {
            name: "stringsing",
            description: "stringstring",
            websiteUrl: "https://MtQPC9zxc.ru"
        };
        const updatedBlogResponse = yield blogsTestManager_1.blogsTestManager.updateBlog(dataForUpdate, receivedBlogById.body.id, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.NO_CONTENT);
        expect(updatedBlogResponse.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        blogGlobalId = receivedBlogById.body.id;
    }));
    it('no delete blog with incorrect id', () => __awaiter(void 0, void 0, void 0, function* () {
        const isDeleted = yield blogsTestManager_1.blogsTestManager.deleteBlog('xzczxc', settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.NOT_FOUND);
        expect(isDeleted).toBe(true);
    }));
    it('no delete blog with correct id', () => __awaiter(void 0, void 0, void 0, function* () {
        const isDeleted = yield blogsTestManager_1.blogsTestManager.deleteBlog(blogGlobalId, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.NO_CONTENT);
        expect(isDeleted).toBe(true);
    }));
});
