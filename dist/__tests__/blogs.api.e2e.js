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
const app_1 = require("../src/app");
const http_status_codes_1 = require("http-status-codes");
const settings_1 = require("../src/settings");
const db_1 = require("../src/db/db");
const mock_1 = require("../src/db/mock");
const blogsTestsManager_1 = require("./test.services/blogsTestsManager");
describe('app', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app).delete(settings_1.SETTINGS.PATH.TEST_DELETE);
    }));
    it('should return "All is running"', () => {
        (0, supertest_1.agent)(app_1.app).get('/').expect(http_status_codes_1.StatusCodes.OK).expect('All is running');
    });
    it('should not found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app).get(settings_1.SETTINGS.PATH.BLOGS).expect(http_status_codes_1.StatusCodes.NOT_FOUND);
    }));
    it('should add array and get blogs with default pagination fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const createdBlogs = yield db_1.blogsCollection.insertMany(mock_1.blogs);
        if (createdBlogs) {
            const res = yield (0, supertest_1.agent)(app_1.app)
                .get(settings_1.SETTINGS.PATH.BLOGS)
                .expect(http_status_codes_1.StatusCodes.OK);
            expect(res.body).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 10,
                items: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        name: expect.any(String),
                        description: expect.any(String),
                        websiteUrl: expect.any(String),
                        createdAt: expect.any(String),
                        isMembership: expect.any(Boolean)
                    })
                ])
            });
        }
    }));
    it('should return array with custom pagination fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.agent)(app_1.app)
            .get(settings_1.SETTINGS.PATH.BLOGS)
            .query({
            pageNumber: 2
        })
            .expect(http_status_codes_1.StatusCodes.OK);
        expect(res.body).toEqual({
            pagesCount: 1,
            page: 2,
            pageSize: 10,
            totalCount: 10,
            items: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    websiteUrl: expect.any(String),
                    createdAt: expect.any(String),
                    isMembership: expect.any(Boolean)
                })
            ])
        });
    }));
    let blogGlobal;
    it('should create blog with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            name: 'a',
            description: 'string',
            websiteUrl: 'https://As3fwcNYmnby.ru'
        };
        yield blogsTestsManager_1.blogsTestsManager.createBlog(body, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.CREATED);
        // получение созданного блога в бд
        blogGlobal = (yield db_1.blogsCollection.findOne({
            name: body.name
        }));
        // проверка созданного блога в бд
        expect(blogGlobal).toEqual({
            _id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            websiteUrl: expect.any(String),
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        });
        expect(blogGlobal.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/);
    }));
    it("shouldn't create blog with incorrect data", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            name: 'aaaaaaaaaaaaaaaaaaaaa',
            description: 'stringstr ingstringstringstr \n \
                ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 stringstr ingstringstringstr \n \
                ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 tringstringstringstringstringstringstringstringstringstringstringstring',
            websiteUrl: 'ttps://As3fwcNYmnby.ru'
        };
        const res = yield blogsTestsManager_1.blogsTestsManager.createBlog(body, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.status).toEqual(http_status_codes_1.StatusCodes.BAD_REQUEST);
        // проверка вернувшщейся ошибки
        return expect(res.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name'
                },
                {
                    message: expect.any(String),
                    field: 'description'
                },
                {
                    message: expect.any(String),
                    field: 'websiteUrl'
                }
            ]
        });
    }));
    it('should create blog with no auth', () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            name: 'a',
            description: 'string',
            websiteUrl: 'https://As3fwcNYmnby.ru'
        };
        yield blogsTestsManager_1.blogsTestsManager.createBlog(body, ' ', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }));
    it('should get blogBy Id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogsTestsManager_1.blogsTestsManager.getBlogById(blogGlobal._id, http_status_codes_1.StatusCodes.OK);
    }));
    it("shouldn't get blogBy Id", () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogsTestsManager_1.blogsTestsManager.getBlogById('aaa', http_status_codes_1.StatusCodes.NOT_FOUND);
    }));
    it("shouldn't update without auth", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            name: 'twentiethStr2',
            websiteUrl: 'https://twentiethString.com',
            description: 'twentiethString22222'
        };
        const auth = 'aaa';
        yield blogsTestsManager_1.blogsTestsManager.updateBlog(blogGlobal._id, body, auth, http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }));
    it("shouldn't update without incorrect body", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            name: 'twentiethStr2twentiethStr2',
            websiteUrl: 'ttps://twentiethString.com',
            description: 'stringstr ingstringstringstr \n \
                ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 stringstr ingstringstringstr \n \
                ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 tringstringstringstringstringstringstringstringstringstringstringstring'
        };
        const auth = settings_1.SETTINGS.ADMIN_AUTH;
        const res = yield blogsTestsManager_1.blogsTestsManager.updateBlog(blogGlobal._id, body, auth, http_status_codes_1.StatusCodes.BAD_REQUEST);
        // проверка вернувшщейся ошибки
        return expect(res.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'name'
                },
                {
                    message: expect.any(String),
                    field: 'description'
                },
                {
                    message: expect.any(String),
                    field: 'websiteUrl'
                }
            ]
        });
    }));
    it('should update with correct body', () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            name: 'twentiethStr2',
            websiteUrl: 'https://twentiethString.com',
            description: 'twentiethString22222'
        };
        const auth = settings_1.SETTINGS.ADMIN_AUTH;
        yield blogsTestsManager_1.blogsTestsManager.updateBlog(blogGlobal._id, body, auth, http_status_codes_1.StatusCodes.NO_CONTENT);
    }));
    it(`shouldn't create post blog by ID with unknown id`, () => __awaiter(void 0, void 0, void 0, function* () {
        const id = '-9';
        const body = {
            title: 'string',
            shortDescription: 'string',
            content: 'string'
        };
        const auth = settings_1.SETTINGS.ADMIN_AUTH;
        yield blogsTestsManager_1.blogsTestsManager.createPostForBlog(id, body, auth, http_status_codes_1.StatusCodes.NOT_FOUND);
    }));
    it(`shouldn't create post blog by ID with incorrect body`, () => __awaiter(void 0, void 0, void 0, function* () {
        const id = blogGlobal._id;
        const body = {
            title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            shortDescription: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
            content: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
        };
        const auth = settings_1.SETTINGS.ADMIN_AUTH;
        const res = yield blogsTestsManager_1.blogsTestsManager.createPostForBlog(id, body, auth, http_status_codes_1.StatusCodes.BAD_REQUEST);
        if (res) {
            expect(res.res.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: 'title'
                    },
                    {
                        message: expect.any(String),
                        field: 'shortDescription'
                    },
                    {
                        message: expect.any(String),
                        field: 'content'
                    }
                ]
            });
        }
    }));
    let postGlobal;
    it('should create post blog by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = blogGlobal._id;
        const body = {
            title: 'string',
            shortDescription: 'string',
            content: 'string'
        };
        const auth = settings_1.SETTINGS.ADMIN_AUTH;
        const result = yield blogsTestsManager_1.blogsTestsManager.createPostForBlog(id, body, auth);
        const res = result === null || result === void 0 ? void 0 : result.res;
        const blog = result === null || result === void 0 ? void 0 : result.blog;
        postGlobal = res.body;
        expect(res.body).toEqual({
            id: expect.any(String),
            title: expect.any(String),
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: blog._id,
            blogName: blog.name,
            createdAt: expect.any(String)
        });
        expect(res.body.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/);
    }));
    it('should return array with posts with default pagination fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.agent)(app_1.app)
            .get(settings_1.SETTINGS.PATH.BLOGS + '/' + blogGlobal._id + '/posts')
            .expect(http_status_codes_1.StatusCodes.OK);
        expect(res.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [postGlobal]
        });
    }));
    it("shouldn't delete blog with incorrect id", () => __awaiter(void 0, void 0, void 0, function* () {
        const auth = settings_1.SETTINGS.ADMIN_AUTH;
        yield blogsTestsManager_1.blogsTestsManager.deleteBlog('1234', auth, http_status_codes_1.StatusCodes.NOT_FOUND);
    }));
    it("shouldn't delete blog with no auth", () => __awaiter(void 0, void 0, void 0, function* () {
        const auth = 'aaa';
        yield blogsTestsManager_1.blogsTestsManager.deleteBlog(blogGlobal._id, auth, http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }));
    it('should delete blog', () => __awaiter(void 0, void 0, void 0, function* () {
        const auth = settings_1.SETTINGS.ADMIN_AUTH;
        yield blogsTestsManager_1.blogsTestsManager.deleteBlog(blogGlobal._id, auth, http_status_codes_1.StatusCodes.NO_CONTENT);
    }));
});
