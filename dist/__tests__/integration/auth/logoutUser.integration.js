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
const userManager_test_1 = require("../../e2e/users/userManager.test");
const settings_1 = require("../../../src/common/config/settings");
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
        expect(isLogout.status).toBe(resultStatus_type_1.ResultStatus.Unauthorized);
    }));
    it('should logout user', () => __awaiter(void 0, void 0, void 0, function* () {
        const tokens = yield authManager_test_1.authManagerTest.createAndAuthUser();
        if (tokens) {
            const isLogout = yield login_service_1.loginService.logout(tokens.refreshToken);
            expect(isLogout.status).toBe(resultStatus_type_1.ResultStatus.Success);
        }
    }));
    it(`shouldn't refresh token if token was logout`, () => __awaiter(void 0, void 0, void 0, function* () {
        const tokens = yield authManager_test_1.authManagerTest.createAndAuthUser();
        if (tokens) {
            const isLogout = yield login_service_1.loginService.logout(tokens.refreshToken);
            const refreshTokens = yield login_service_1.loginService.refreshToken(tokens.refreshToken);
            expect(refreshTokens.status).toBe(resultStatus_type_1.ResultStatus.Unauthorized);
            expect(isLogout.status).toBe(resultStatus_type_1.ResultStatus.Success);
        }
    }));
    it('should logout and error if try refresh token with old token', () => __awaiter(void 0, void 0, void 0, function* () {
        //todo непонятно почему этот тест падает
        const inputData = {
            loginOrEmail: 'login',
            password: 'qwert1234',
        };
        yield userManager_test_1.userManagerTest.createUser('default', settings_1.SETTINGS.ADMIN_AUTH);
        const tokens = yield authManager_test_1.authManagerTest.authUser(inputData);
        const newTokens = yield login_service_1.loginService.refreshToken(tokens.refreshToken);
        expect(tokens.refreshToken).not.toBe(newTokens.data.refreshToken);
        const isRefreshed = yield login_service_1.loginService.refreshToken(tokens.refreshToken);
        expect(isRefreshed.status).toBe(resultStatus_type_1.ResultStatus.Unauthorized);
        const result = yield login_service_1.loginService.logout(tokens.refreshToken);
        // expect(result.status).toBe(ResultStatus.Unauthorized)
    }));
});
