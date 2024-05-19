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
exports.authManagerTest = void 0;
const supertest_1 = require("supertest");
const app_1 = require("../../../src/app");
const settings_1 = require("../../../src/common/config/settings");
const http_status_codes_1 = require("http-status-codes");
const userManager_test_1 = require("../users/userManager.test");
exports.authManagerTest = {
    /**
     * 'login': 'alexx123',
     * 'password': '123456',
     * 'email': 'asdasdas@e.com'
     */
    //todo стоит переписать с возвратом refresh token и без зависимости от api (сразу работа с базой)
    createAndAuthUser() {
        return __awaiter(this, arguments, void 0, function* (loginData = 'default', newUserData = 'default', expectedStatus = http_status_codes_1.StatusCodes.OK) {
            if (newUserData === 'default') {
                newUserData = {
                    'login': 'alexx123',
                    'password': '123456',
                    'email': 'asdasdas@e.com'
                };
            }
            yield userManager_test_1.userManagerTest.createUser(newUserData, settings_1.SETTINGS.ADMIN_AUTH);
            let res;
            switch (loginData) {
                case 'default': {
                    loginData = {
                        'loginOrEmail': 'alexx123',
                        'password': '123456'
                    };
                    res = yield (0, supertest_1.agent)(app_1.app)
                        .post(`${settings_1.SETTINGS.PATH.AUTH}/login`)
                        .send(loginData)
                        .expect(expectedStatus);
                    break;
                }
                case null: {
                    res = yield (0, supertest_1.agent)(app_1.app)
                        .post(`${settings_1.SETTINGS.PATH.AUTH}/login`)
                        .expect(expectedStatus);
                    break;
                }
                default: {
                    res = yield (0, supertest_1.agent)(app_1.app)
                        .post(`${settings_1.SETTINGS.PATH.AUTH}/login`)
                        .send(loginData)
                        .expect(expectedStatus);
                }
            }
            if (expectedStatus === http_status_codes_1.StatusCodes.OK) {
                expect(res.body).toEqual({
                    'accessToken': res.body.accessToken
                });
                const getUserByToken = yield (0, supertest_1.agent)(app_1.app)
                    .get(`${settings_1.SETTINGS.PATH.AUTH}/me`)
                    .set({ authorization: `Bearer ${res.body.accessToken}`
                });
                expect(getUserByToken.body).toEqual({
                    'email': newUserData.email,
                    'login': newUserData.login,
                    'userId': expect.any(String)
                });
                return res.body.accessToken;
            }
            else {
                return undefined;
            }
        });
    },
    authUser() {
        return __awaiter(this, arguments, void 0, function* (loginData = 'default', expectedStatus = http_status_codes_1.StatusCodes.OK) {
            let res;
            if (loginData === 'default') {
                loginData = {
                    'loginOrEmail': 'alexx123',
                    'password': '123456'
                };
                res = yield (0, supertest_1.agent)(app_1.app)
                    .post(`${settings_1.SETTINGS.PATH.AUTH}/login`)
                    .send(loginData)
                    .expect(expectedStatus);
            }
            else {
                res = yield (0, supertest_1.agent)(app_1.app)
                    .post(`${settings_1.SETTINGS.PATH.AUTH}/login`)
                    .send(loginData)
                    .expect(expectedStatus);
            }
            if (expectedStatus === http_status_codes_1.StatusCodes.OK) {
                expect(res.body).toEqual({
                    'accessToken': res.body.accessToken
                });
                const refreshToken = res.header['set-cookie'][0].split('; ')[0].replace('refreshToken=', '');
                return { accessToken: res.body.accessToken, refreshToken };
            }
            else {
                return undefined;
            }
        });
    }
};
