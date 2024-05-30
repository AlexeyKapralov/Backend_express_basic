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
const jwt_service_1 = require("../../../src/common/adapters/jwt.service");
const userManager_test_1 = require("../../e2e/users/userManager.test");
const settings_1 = require("../../../src/common/config/settings");
const authManager_test_1 = require("../../e2e/auth/authManager.test");
const devicesService_1 = require("../../../src/features/securityDevices/service/devicesService");
const resultStatus_type_1 = require("../../../src/common/types/resultStatus.type");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const db_1 = require("../../../src/db/db");
const globals_1 = require("@jest/globals");
describe('integration test delete device', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    let device;
    let tokens;
    let tokens2;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
        const userData = {
            login: 'login',
            password: 'qwert1234',
            email: 'asdf@mail.ru'
        };
        yield userManager_test_1.userManagerTest.createUser(userData, settings_1.SETTINGS.ADMIN_AUTH);
        tokens = yield authManager_test_1.authManagerTest.authUser({
            loginOrEmail: userData.email,
            password: userData.password
        });
        device = jwt_service_1.jwtService.decodeToken(tokens.refreshToken);
        const userData2 = {
            login: 'login2',
            password: 'qwert1234',
            email: 'asdf2@mail.ru'
        };
        yield userManager_test_1.userManagerTest.createUser(userData2, settings_1.SETTINGS.ADMIN_AUTH);
        tokens2 = yield authManager_test_1.authManagerTest.authUser({
            loginOrEmail: userData2.email,
            password: userData2.password
        });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        globals_1.jest.useRealTimers();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
    it('should return success with correct token + deviceID', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield devicesService_1.devicesService.deleteDevice(device.deviceId, tokens.refreshToken);
        expect(res.status === resultStatus_type_1.ResultStatus.Success);
    }));
    it('should return unauthorized with incorrect token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield devicesService_1.devicesService.deleteDevice(device.deviceId, '123');
        expect(res.status === resultStatus_type_1.ResultStatus.Unauthorized);
    }));
    it('should return unauthorized with incorrect deviceId', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield devicesService_1.devicesService.deleteDevice('123', tokens.refreshToken);
        expect(res.status === resultStatus_type_1.ResultStatus.Unauthorized);
    }));
    it('should return forbidden with another deviceID', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield devicesService_1.devicesService.deleteDevice(device.deviceId, tokens2.refreshToken);
        expect(res.status === resultStatus_type_1.ResultStatus.Forbidden);
    }));
});
