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
const auth_service_1 = require("../../../src/features/auth/service/auth.service");
const resultStatus_type_1 = require("../../../src/common/types/resultStatus.type");
const db_1 = require("../../../src/db/db");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const userManager_test_1 = require("../../e2e/users/userManager.test");
const settings_1 = require("../../../src/common/config/settings");
const jwt_service_1 = require("../../../src/common/adapters/jwt.service");
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
        const isLogout = yield auth_service_1.authService.logout('123', '1234', 10);
        expect(isLogout.status).toBe(resultStatus_type_1.ResultStatus.Unauthorized);
    }));
    it('should logout user', () => __awaiter(void 0, void 0, void 0, function* () {
        const tokens = yield authManager_test_1.authManagerTest.createAndAuthUser();
        if (tokens) {
            const tokenPayload = jwt_service_1.jwtService.verifyAndDecodeToken(tokens.refreshToken);
            const logoutResult = yield auth_service_1.authService.logout(tokenPayload.deviceId, tokenPayload.userId, tokenPayload.iat);
            expect(logoutResult.status).toBe(resultStatus_type_1.ResultStatus.Success);
        }
    }));
    it(`shouldn't refresh token if token was logout`, () => __awaiter(void 0, void 0, void 0, function* () {
        const tokens = yield authManager_test_1.authManagerTest.createAndAuthUser();
        if (tokens) {
            const tokenPayload = jwt_service_1.jwtService.verifyAndDecodeToken(tokens.refreshToken);
            const isLogout = yield auth_service_1.authService.logout(tokenPayload.deviceId, tokenPayload.userId, tokenPayload.iat);
            const refreshTokens = yield auth_service_1.authService.refreshToken(tokenPayload.deviceId, tokenPayload.userId, tokenPayload.iat);
            expect(refreshTokens.status).toBe(resultStatus_type_1.ResultStatus.Unauthorized);
            expect(isLogout.status).toBe(resultStatus_type_1.ResultStatus.Success);
        }
    }));
    it('should logout and error if try refresh token with old token', () => __awaiter(void 0, void 0, void 0, function* () {
        const inputData = {
            loginOrEmail: 'login',
            password: 'qwert1234',
        };
        yield userManager_test_1.userManagerTest.createUser('default', settings_1.SETTINGS.ADMIN_AUTH);
        const tokens1 = yield authManager_test_1.authManagerTest.authUser(inputData);
        const tokenPayload1 = jwt_service_1.jwtService.verifyAndDecodeToken(tokens1.refreshToken);
        yield new Promise(resolve => setTimeout(resolve, 1000));
        const tokens2 = yield auth_service_1.authService.refreshToken(tokenPayload1.deviceId, tokenPayload1.userId, tokenPayload1.iat);
        const tokenPayload2 = jwt_service_1.jwtService.verifyAndDecodeToken(tokens2.data.refreshToken);
        expect(tokens1.refreshToken).not.toBe(tokens2.data.refreshToken);
        yield new Promise(resolve => setTimeout(resolve, 1000));
        const tokens2Repeat = yield auth_service_1.authService.refreshToken(tokenPayload1.deviceId, tokenPayload1.userId, tokenPayload1.iat);
        const tokens3 = yield auth_service_1.authService.refreshToken(tokenPayload2.deviceId, tokenPayload2.userId, tokenPayload2.iat);
        const tokenPayload3 = jwt_service_1.jwtService.verifyAndDecodeToken(tokens3.data.refreshToken);
        expect(tokens2Repeat.status).toBe(resultStatus_type_1.ResultStatus.Unauthorized);
        expect(tokens3.status).toBe(resultStatus_type_1.ResultStatus.Success);
        const logoutResult1 = yield auth_service_1.authService.logout(tokenPayload1.deviceId, tokenPayload1.userId, tokenPayload1.iat);
        const logoutResult2 = yield auth_service_1.authService.logout(tokenPayload2.deviceId, tokenPayload2.userId, tokenPayload2.iat);
        const logoutResult3 = yield auth_service_1.authService.logout(tokenPayload3.deviceId, tokenPayload3.userId, tokenPayload3.iat);
        expect(logoutResult1.status).toBe(resultStatus_type_1.ResultStatus.Unauthorized);
        expect(logoutResult2.status).toBe(resultStatus_type_1.ResultStatus.Unauthorized);
        expect(logoutResult3.status).toBe(resultStatus_type_1.ResultStatus.Success);
    }));
});
