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
const userManager_test_1 = require("../../e2e/users/userManager.test");
const settings_1 = require("../../../src/common/config/settings");
const authManager_test_1 = require("../../e2e/auth/authManager.test");
const login_service_1 = require("../../../src/features/auth/service/login.service");
const resultStatus_type_1 = require("../../../src/common/types/resultStatus.type");
describe('refresh Token integration test', () => {
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
    it('should refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
        const inputData = {
            login: 'login',
            password: 'qwert1234',
            email: 'asdf@mail.ru'
        };
        yield userManager_test_1.userManagerTest.createUser('default', settings_1.SETTINGS.ADMIN_AUTH);
        const tokens = yield authManager_test_1.authManagerTest.authUser({ password: inputData.password, loginOrEmail: inputData.login });
        let newTokens = yield login_service_1.loginService.refreshToken(tokens.refreshToken);
        expect(newTokens.data).not.toBe(tokens);
        expect(newTokens.status).toBe(resultStatus_type_1.ResultStatus.Success);
    }));
});
