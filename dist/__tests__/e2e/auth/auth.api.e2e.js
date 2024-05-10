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
const http_status_codes_1 = require("http-status-codes");
const authManager_test_1 = require("./authManager.test");
describe('auth test', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
    }));
    it(`should write All is running `, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app)
            .get('/')
            .expect('All is running!');
    }));
    it(`should auth`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield authManager_test_1.authManagerTest.createAndAuthUser();
    }));
    it(`shouldn't auth`, () => __awaiter(void 0, void 0, void 0, function* () {
        const newBadLoginData = {
            loginOrEmail: 'avc',
            password: 'axzcxzc'
        };
        yield authManager_test_1.authManagerTest.createAndAuthUser(newBadLoginData, 'default', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
});
