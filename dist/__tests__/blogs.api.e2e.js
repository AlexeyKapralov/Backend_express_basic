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
const setttings_1 = require("../src/setttings");
const db_1 = require("../src/db/db");
const mock_1 = require("../src/db/mock");
describe('app', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app).delete(setttings_1.SETTINGS.PATH.TEST_DELETE);
    }));
    it('should return "All is running"', () => {
        (0, supertest_1.agent)(app_1.app).get('/').expect(http_status_codes_1.StatusCodes.OK).expect('All is running');
    });
    it('should return empty array with default pagination fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.agent)(app_1.app)
            .get(setttings_1.SETTINGS.PATH.BLOGS)
            .expect(http_status_codes_1.StatusCodes.OK);
        expect(res.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        });
    }));
    it('should add array and get blogs with default pagination fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const createdBlogs = yield db_1.blogsCollection.insertMany(mock_1.blogs);
        if (createdBlogs) {
            const res = yield (0, supertest_1.agent)(app_1.app)
                .get(setttings_1.SETTINGS.PATH.BLOGS)
                .expect(http_status_codes_1.StatusCodes.OK);
            expect(res.body).toEqual({
                pagesCount: 2,
                page: 1,
                pageSize: 10,
                totalCount: 20,
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
});
