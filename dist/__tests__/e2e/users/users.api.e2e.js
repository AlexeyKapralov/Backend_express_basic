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
const app_1 = require("../../../src/app");
const db_1 = require("../../../src/db/db");
const settings_1 = require("../../../src/common/config/settings");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const userManager_test_1 = require("./userManager.test");
const http_status_codes_1 = require("http-status-codes");
const userMappers_1 = require("../../../src/features/users/mappers/userMappers");
const path_1 = require("../../../src/common/config/path");
const user_dto_1 = require("../../../src/features/users/domain/user.dto");
describe('user tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    it('should get users with default pagination', () => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
        yield userManager_test_1.userManagerTest.createUsers(20);
        const res = yield (0, supertest_1.agent)(app_1.app)
            .get(path_1.PATH.USERS);
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
                })
            ])
        });
        const users = yield user_dto_1.UsersModel
            .find()
            .sort({ createdAt: 'desc' })
            .skip((1 - 1) * 10)
            .limit(10)
            .lean();
        expect(users.map(userMappers_1.getUserViewModel)).toEqual(res.body.items);
    }));
    it('should get with input custom pagination', () => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
        yield userManager_test_1.userManagerTest.createUsers(20);
        const res = yield (0, supertest_1.agent)(app_1.app)
            .get(path_1.PATH.USERS)
            .query({
            sortBy: 'login',
            sortDirection: 'asc',
            pageNumber: 2,
            pageSize: 5,
            searchLoginTerm: 'John',
            searchEmailTerm: '1'
        });
        const users = yield user_dto_1.UsersModel
            .find({
            $or: [
                { login: { $regex: 'John', $options: 'i' } },
                { email: { $regex: '1', $options: 'i' } }
            ]
        })
            .sort({ login: 'asc' })
            .skip((2 - 1) * 5)
            .limit(5)
            .lean();
        const countUsers = yield user_dto_1.UsersModel
            .find({
            $or: [
                { login: { $regex: 'John', $options: 'i' } },
                { email: { $regex: '1', $options: 'i' } }
            ]
        })
            .lean();
        expect(res.body).toEqual({
            pagesCount: Math.ceil(countUsers.length / 5),
            page: 2,
            pageSize: 5,
            totalCount: countUsers.length,
            items: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    login: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
                })
            ])
        });
        expect(users.map(userMappers_1.getUserViewModel)).toEqual(res.body.items);
    }));
    //test create
    it(`shouldn't create user with auth and incorrect input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            login: 'd',
            password: 'a',
            email: 'waterasdasd@e'
        };
        yield userManager_test_1.userManagerTest.createUser(data, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }));
    it(`shouldn't create user with auth and correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            login: 'WwldYc21wu',
            password: 'string',
            email: 'gHVEtCudxVZoK6ETpak74_r4X6TF-Yjyr-16FPZBouaMivMioRm21fgOP9RsaUHKqiit@oOxUwm6fKkBjstdw-wSawULg8PmBk9lAV06XQr9RE6aw_S9n5Is9qnLZweVHOwijtrgHhXuz7YjZ9PTChhkfYly4gq1Q1g2nz4o.dFIw'
        };
        yield userManager_test_1.userManagerTest.createUser(data, 'no_valid_credentials', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }));
    it('should create user with auth and correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            login: 'WwldYc21wu',
            password: 'string',
            email: 'asw@mail.ru'
        };
        yield userManager_test_1.userManagerTest.createUser(data, settings_1.SETTINGS.ADMIN_AUTH);
    }));
    //test delete
    it(`shouldn't delete user with unknown id`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield userManager_test_1.userManagerTest.deleteUser('aaaaa', settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.NOT_FOUND);
    }));
    it(`should delete user with correct id`, () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_dto_1.UsersModel.findOne();
        yield userManager_test_1.userManagerTest.deleteUser(user._id, settings_1.SETTINGS.ADMIN_AUTH);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
});
