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
const authManager_test_1 = require("../auth/authManager.test");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const db_1 = require("../../../src/db/db");
const http_status_codes_1 = require("http-status-codes");
const supertest_1 = require("supertest");
const app_1 = require("../../../src/app");
const settings_1 = require("../../../src/common/config/settings");
const jwt_service_1 = require("../../../src/common/adapters/jwt.service");
const userManager_test_1 = require("../users/userManager.test");
const path_1 = require("../../../src/common/config/path");
const devices_entity_1 = require("../../../src/features/securityDevices/domain/devices.entity");
describe('e2e test for devices', () => {
    let tokensUser1;
    let tokensUser2;
    let tokensUser3;
    let tokensUser4;
    let user1;
    let user2;
    let tokensAnotherUser1;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.drop();
        // todo написать функцию для авторизации пользователей
        // Создаем пользователя, логиним пользователя 4 раза с разныными user-agent;
        user1 = yield userManager_test_1.userManagerTest.createUser('default', settings_1.SETTINGS.ADMIN_AUTH);
        tokensUser1 = yield authManager_test_1.authManagerTest.createAndAuthUser('default', 'default', http_status_codes_1.StatusCodes.OK, '1.1.1.1');
        tokensUser2 = yield authManager_test_1.authManagerTest.authUser('default', http_status_codes_1.StatusCodes.OK, '2.2.2.2');
        tokensUser3 = yield authManager_test_1.authManagerTest.authUser('default', http_status_codes_1.StatusCodes.OK, '3.3.3.3');
        tokensUser4 = yield authManager_test_1.authManagerTest.authUser('default', http_status_codes_1.StatusCodes.OK, '4.4.4.4');
        const newInputData = {
            loginOrEmail: 'alexx1234',
            password: '123456'
        };
        const newUserData = {
            login: 'alexx1234',
            password: '123456',
            email: 'asdasdas@ea.com'
        };
        user2 = yield userManager_test_1.userManagerTest.createUser(newUserData, settings_1.SETTINGS.ADMIN_AUTH);
        tokensAnotherUser1 = yield authManager_test_1.authManagerTest.authUser(newInputData);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
    it('Should get a device list of devices', () => __awaiter(void 0, void 0, void 0, function* () {
        // проверяем всё ли создалось
        const refreshToken = tokensUser4.refreshToken;
        const result = yield (0, supertest_1.agent)(app_1.app)
            .get(`${path_1.PATH.SECURITY}/devices`)
            .set('Cookie', [`refreshToken=${refreshToken}`]);
        expect(result.body.length).toBe(4);
    }));
    it('Should delete another devices', () => __awaiter(void 0, void 0, void 0, function* () {
        // удаляем девайсы
        const refreshToken = tokensUser4.refreshToken;
        const result = yield (0, supertest_1.agent)(app_1.app)
            .delete(`${path_1.PATH.SECURITY}/devices`)
            .set('Cookie', [`refreshToken=${refreshToken}`]);
        //проверяем статус
        expect(result.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        //смотрим что в базе остался один
        const userID = jwt_service_1.jwtService.getUserIdByToken(refreshToken);
        const devices = yield devices_entity_1.DeviceModel.find({ userId: userID }).lean();
        expect(devices.length).toBe(1);
    }));
    it(`Shouldn't delete device with token from another user`, () => __awaiter(void 0, void 0, void 0, function* () {
        // удаляем девайсы
        const refreshToken = tokensAnotherUser1.refreshToken;
        const device = jwt_service_1.jwtService.verifyAndDecodeToken(tokensUser1.refreshToken);
        const result = yield (0, supertest_1.agent)(app_1.app)
            .delete(`${path_1.PATH.SECURITY}/devices/${device.deviceId}`)
            .set('Cookie', [`refreshToken=${refreshToken}`]);
        //проверяем статус
        expect(result.status).toBe(http_status_codes_1.StatusCodes.FORBIDDEN);
        //смотрим что в базе остался один
        // const userID = jwtService.getUserIdByToken(refreshToken)
        // const devices = await db.getCollection().devices.find({userId: userID!}).toArray()
        // expect(devices.length).toBe(4)
    }));
    it(`Should delete device`, () => __awaiter(void 0, void 0, void 0, function* () {
        // удаляем девайсы
        const refreshToken = tokensUser1.refreshToken;
        const device = jwt_service_1.jwtService.verifyAndDecodeToken(tokensUser1.refreshToken);
        const result = yield (0, supertest_1.agent)(app_1.app)
            .delete(`${path_1.PATH.SECURITY}/devices/${device.deviceId}`)
            .set('Cookie', [`refreshToken=${refreshToken}`]);
        //проверяем статус
        expect(result.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        //смотрим что в базе остался один
        // const userID = jwtService.getUserIdByToken(refreshToken)
        // const devices = await db.getCollection().devices.find({userId: userID!}).toArray()
        // expect(devices.length).toBe(4)
    }));
});
