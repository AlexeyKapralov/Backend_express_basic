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
const supertest_1 = require("supertest");
describe('', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app).delete(`${settings_1.SETTINGS.PATH.TESTS}`);
    }));
    it('should get blogs', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app)
            .get(`${settings_1.SETTINGS.PATH.BLOGS}`)
            .expect(utils_1.HTTP_STATUSES.OK_200)
            .expect([]);
    }));
    let createdBlogGlobal;
    it('should create blog', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "123",
            description: "string",
            websiteUrl: "https://google.com"
        };
        const { createdBlog } = yield blogsTestManager_1.blogsTestManager.createBlog(data, settings_1.SETTINGS.ADMIN_AUTH);
        createdBlogGlobal = createdBlog;
        //или прямо из бд
        yield (0, supertest_1.agent)(app_1.app)
            .get(settings_1.SETTINGS.PATH.BLOGS)
            .expect(utils_1.HTTP_STATUSES.OK_200, [createdBlogGlobal]);
    }));
    it(`shouldn't create blog with incorrect data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "strinasdasdasdasdasdasdasdadsadasdasdasdg",
            description: "asd",
            websiteUrl: "https://google.comdasdasd"
        };
        const { response } = yield blogsTestManager_1.blogsTestManager.createBlog(data, settings_1.SETTINGS.ADMIN_AUTH, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        return expect(response.status).toBe(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
    }));
    it('should find blog by id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app)
            .get(`${settings_1.SETTINGS.PATH.BLOGS}/${createdBlogGlobal.id}`)
            .expect(utils_1.HTTP_STATUSES.OK_200, createdBlogGlobal);
    }));
    it(`shouldn't find blog by id`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app)
            .get(`${settings_1.SETTINGS.PATH.BLOGS}/adzxafqwr`)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    let updatedBlogGlobal;
    it('should update blog with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const BlogForUpdate = {
            name: "new Name",
            description: "new Description",
            websiteUrl: "https://newSite.com"
        };
        const { updatedBlog } = yield blogsTestManager_1.blogsTestManager.updateBlog(createdBlogGlobal.id, BlogForUpdate, settings_1.SETTINGS.ADMIN_AUTH, utils_1.HTTP_STATUSES.NO_CONTENT_204);
        if (updatedBlog) {
            updatedBlogGlobal = updatedBlog;
        }
        yield (0, supertest_1.agent)(app_1.app)
            .get(`${settings_1.SETTINGS.PATH.BLOGS}`)
            .expect(utils_1.HTTP_STATUSES.OK_200)
            .expect([updatedBlogGlobal]);
    }));
    it(`shouldn't update blog with incorrect data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const BlogForUpdate = {
            name: "new Nameasdasdadsad",
            description: "new Description",
            websiteUrl: "https://newSiteasdadasdascom"
        };
        const { updatedBlog } = yield blogsTestManager_1.blogsTestManager.updateBlog(createdBlogGlobal.id, BlogForUpdate, settings_1.SETTINGS.ADMIN_AUTH, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        if (updatedBlog) {
            updatedBlogGlobal = updatedBlog;
        }
        yield (0, supertest_1.agent)(app_1.app)
            .get(`${settings_1.SETTINGS.PATH.BLOGS}`)
            .expect(utils_1.HTTP_STATUSES.OK_200)
            .expect([updatedBlogGlobal]);
    }));
    it(`shouldn't delete blog with unknown id `, () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogsTestManager_1.blogsTestManager
            .deleteBlog('xzcaqwe', settings_1.SETTINGS.ADMIN_AUTH, utils_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.agent)(app_1.app)
            .get(`${settings_1.SETTINGS.PATH.BLOGS}`)
            .expect(utils_1.HTTP_STATUSES.OK_200)
            .expect([updatedBlogGlobal]);
    }));
    it('should delete blog', () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogsTestManager_1.blogsTestManager
            .deleteBlog(updatedBlogGlobal.id, settings_1.SETTINGS.ADMIN_AUTH, utils_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.agent)(app_1.app)
            .get(`${settings_1.SETTINGS.PATH.BLOGS}`)
            .expect(utils_1.HTTP_STATUSES.OK_200)
            .expect([]);
    }));
});
