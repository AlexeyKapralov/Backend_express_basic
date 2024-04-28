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
const db_1 = require("../../src/db/db");
const settings_1 = require("../../src/common/config/settings");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const user_test_manager_1 = require("./user.test.manager");
const http_status_codes_1 = require("http-status-codes");
describe('user tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    //TODO: написать тесты для проверки работы пагиинации
    it('should get users with default pagination', () => __awaiter(void 0, void 0, void 0, function* () {
        yield user_test_manager_1.userTestManager.createUsers(20);
        const res = yield (0, supertest_1.agent)(app_1.app)
            .get(settings_1.SETTINGS.PATH.USERS);
        expect(res.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 10,
            totalCount: 20,
            items: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    login: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                    password: expect.any(String)
                })
            ])
        });
    }));
    it(`shouldn't create user with auth and incorrect input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            login: 'd',
            password: 'a',
            email: 'waterasdasd@e'
        };
        yield user_test_manager_1.userTestManager.createUser(data, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }));
    it(`shouldn't create user with auth and correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            login: 'WwldYc21wu',
            password: 'string',
            email: 'gHVEtCudxVZoK6ETpak74_r4X6TF-Yjyr-16FPZBouaMivMioRm21fgOP9RsaUHKqiit@oOxUwm6fKkBjstdw-wSawULg8PmBk9lAV06XQr9RE6aw_S9n5Is9qnLZweVHOwijtrgHhXuz7YjZ9PTChhkfYly4gq1Q1g2nz4o.dFIw'
        };
        yield user_test_manager_1.userTestManager.createUser(data, 'no_valid_credentials', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }));
    it('should create user with auth and correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            login: 'WwldYc21wu',
            password: 'string',
            email: 'asw@mail.ru'
        };
        yield user_test_manager_1.userTestManager.createUser(data, settings_1.SETTINGS.ADMIN_AUTH);
    }));
    //todo: тесты на удаление юзера
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
});
