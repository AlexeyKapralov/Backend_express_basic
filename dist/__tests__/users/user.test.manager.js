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
exports.userTestManager = void 0;
const supertest_1 = require("supertest");
const settings_1 = require("../../src/common/config/settings");
const app_1 = require("../../src/app");
const http_status_codes_1 = require("http-status-codes");
const bcrypt_service_1 = require("../../src/common/adapters/bcrypt.service");
exports.userTestManager = {
    createUser(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, auth = '', expected_status = http_status_codes_1.StatusCodes.CREATED) {
            const buff = Buffer.from(auth, 'utf-8');
            const decodedAuth = buff.toString('base64');
            const result = yield (0, supertest_1.agent)(app_1.app)
                .post(settings_1.SETTINGS.PATH.USERS)
                .send(data)
                .set({ authorization: `Basic ${decodedAuth}` });
            expect(result.status).toBe(expected_status);
            if (result.status === http_status_codes_1.StatusCodes.CREATED) {
                expect(result.body).toEqual({
                    login: data.login,
                    password: expect.any(String),
                    email: data.email,
                    createdAt: expect.any(String),
                    id: expect.any(String)
                });
                const salt = result.body.password.slice(0, 29);
                const passHash = yield bcrypt_service_1.bcryptService.createPasswordHash(data.password, salt);
                const createdPassHash = yield bcrypt_service_1.bcryptService.createPasswordHash(result.body.password);
                const isTruePass = yield bcrypt_service_1.bcryptService.comparePasswordsHash(passHash, createdPassHash);
                expect(isTruePass).toBe(true);
            }
        });
    }
};
