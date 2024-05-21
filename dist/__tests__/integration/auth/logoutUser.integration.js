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
const authManager_test_1 = require("../../e2e/auth/authManager.test");
const login_service_1 = require("../../../src/service/login.service");
const resultStatus_type_1 = require("../../../src/common/types/resultStatus.type");
const db_1 = require("../../../src/db/db");
const mongodb_memory_server_1 = require("mongodb-memory-server");
describe('logout user integration test', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
    it(`shouldn't logout user with incorrect token`, () => __awaiter(void 0, void 0, void 0, function* () {
        const isLogout = yield login_service_1.loginService.logout('123');
        const isBlocked = yield db_1.db.getCollection().blockListCollection.findOne({ refreshToken: '123' });
        expect(isBlocked).toBe(null);
        expect(isLogout.status).toBe(resultStatus_type_1.ResultStatus.NotFound);
    }));
    it('should logout user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield authManager_test_1.authManagerTest.createAndAuthUser();
        const result = yield authManager_test_1.authManagerTest.authUser();
        if (result) {
            const isLogout = yield login_service_1.loginService.logout(result.refreshToken);
            const isBlocked = yield db_1.db.getCollection().blockListCollection.findOne({ refreshToken: result.refreshToken });
            expect(isBlocked).not.toBe(null);
            expect(isLogout.status).toBe(resultStatus_type_1.ResultStatus.Success);
        }
    }));
});
