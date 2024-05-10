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
const db_1 = require("../../../src/db/db");
const settings_1 = require("../../../src/common/config/settings");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const http_status_codes_1 = require("http-status-codes");
const mongodb_1 = require("mongodb");
const supertest_1 = require("supertest");
const app_1 = require("../../../src/app");
const bcrypt_service_1 = require("../../../src/common/adapters/bcrypt.service");
describe('user tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    it(`shouldn't auth user `, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            _id: String(new mongodb_1.ObjectId()),
            login: 'WwldYc21wu',
            password: yield bcrypt_service_1.bcryptService.createPasswordHash('string'),
            email: 'asw@mail.ru',
            createdAt: new Date().toISOString(),
            confirmationCodeExpired: new Date(),
            isConfirmed: true,
            confirmationCode: 'abcd'
        };
        yield db_1.db.getCollection().usersCollection.insertOne(data);
        const buff = Buffer.from(settings_1.SETTINGS.ADMIN_AUTH || '', 'utf-8');
        const decodedAuth = buff.toString('base64');
        const authData = {
            loginOrEmail: 'WwldYc21wu',
            password: 'string_no_valid'
        };
        const result = yield (0, supertest_1.agent)(app_1.app)
            .post(settings_1.SETTINGS.PATH.AUTH + '/login')
            .send(authData)
            .set({ authorization: `Basic ${decodedAuth}` });
        expect(result.status).toBe(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }));
    it(`should auth user `, () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            _id: String(new mongodb_1.ObjectId()),
            login: 'WwldYc21wu',
            password: yield bcrypt_service_1.bcryptService.createPasswordHash('string'),
            email: 'asw@mail.ru',
            createdAt: new Date().toISOString(),
            confirmationCode: 'abc',
            isConfirmed: true,
            confirmationCodeExpired: new Date(),
        };
        yield db_1.db.getCollection().usersCollection.insertOne(data);
        const buff = Buffer.from(settings_1.SETTINGS.ADMIN_AUTH || '', 'utf-8');
        const decodedAuth = buff.toString('base64');
        const authData = {
            loginOrEmail: 'WwldYc21wu',
            password: 'string'
        };
        const result = yield (0, supertest_1.agent)(app_1.app)
            .post(settings_1.SETTINGS.PATH.AUTH + '/login')
            .send(authData)
            .set({ authorization: `Basic ${decodedAuth}` });
        expect(result.status).toBe(http_status_codes_1.StatusCodes.OK);
    }));
    afterAll(done => {
        done();
    });
});
