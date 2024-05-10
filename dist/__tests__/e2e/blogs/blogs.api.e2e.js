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
const supertest_1 = require("supertest");
const app_1 = require("../../../src/app");
const settings_1 = require("../../../src/common/config/settings");
const mappers_1 = require("../../../src/common/utils/mappers");
const blogsManager_test_1 = require("./blogsManager.test");
const authManager_test_1 = require("../auth/authManager.test");
const http_status_codes_1 = require("http-status-codes");
describe('blogs tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
    }));
    it(`should get blogs with filter `, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app)
            .get('/')
            .expect('All is running!');
    }));
    //TODO: тесты для get (default pagination + custom) + должен быть пустой массив и пагинация если нет блогов
    it('should get blogs with default pagination and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.agent)(app_1.app)
            .get(settings_1.SETTINGS.PATH.BLOGS);
        expect(res.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        });
    }));
    it('should get blogs with custom pagination', () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogsManager_test_1.blogsManagerTest.createBlogs(40);
        const query = {
            searchNameTerm: 'lo',
            pageNumber: 2,
            pageSize: 5,
            sortBy: 'description',
            sortDirection: 'asc'
        };
        const res = yield (0, supertest_1.agent)(app_1.app)
            .get(settings_1.SETTINGS.PATH.BLOGS)
            .query(query);
        const totalCount = yield db_1.db.getCollection().blogsCollection
            .countDocuments({ name: { $regex: query.searchNameTerm, $options: 'i' } });
        const blogs = yield db_1.db.getCollection().blogsCollection
            .find({ name: { $regex: query.searchNameTerm, $options: 'i' } })
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray();
        expect(res.body).toEqual({
            pagesCount: Math.ceil((totalCount / query.pageSize)),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: totalCount,
            items: expect.arrayContaining([
                expect.objectContaining({
                    createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                    description: expect.any(String),
                    id: expect.any(String),
                    isMembership: expect.any(Boolean),
                    name: expect.any(String),
                    websiteUrl: expect.any(String)
                })
            ])
        });
        expect(blogs.map(mappers_1.getBlogViewModel)).toEqual(res.body.items);
    }));
    //тесты для post (positive + negative)
    it(`shouldn't create blog with no auth`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield blogsManager_test_1.blogsManagerTest.createBlog('default', 'accessToken', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }));
    it(`shouldn't create blog with no correct data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const accessToken = yield authManager_test_1.authManagerTest.createAndAuthUser();
        const data = {
            'name': '',
            'description': '',
            'websiteUrl': 'ttp://oBAS8Qf.ru'
        };
        if (accessToken) {
            const result = yield blogsManager_test_1.blogsManagerTest.createBlog(data, accessToken, http_status_codes_1.StatusCodes.BAD_REQUEST);
            expect(result).toEqual({
                "errorsMessages": expect.arrayContaining([
                    {
                        "message": expect.any(String),
                        "field": expect.any(String)
                    }
                ])
            });
        }
    }));
    it(`should create blog`, () => __awaiter(void 0, void 0, void 0, function* () {
        const accessToken = yield authManager_test_1.authManagerTest.createAndAuthUser();
        const data = {
            'name': 'timma',
            'description': 'bbbbb',
            'websiteUrl': 'https://oBAS8Qf.ru'
        };
        if (accessToken) {
            yield blogsManager_test_1.blogsManagerTest.createBlog(data, accessToken);
        }
        const blog = yield db_1.db.getCollection().blogsCollection.findOne({ name: data.name });
        expect(blog).toEqual({
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            _id: expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            isMembership: expect.any(Boolean)
        });
    }));
    //TODO: тесты для get post by blog id
    //TODO: тесты для create post by blog id
    //TODO: тесты для get blog by id
    //TODO: тесты для put blog by id
    //TODO: тесты для delete blog by id
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
});
