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
exports.blogsManagerTest = void 0;
const supertest_1 = require("supertest");
const app_1 = require("../../../src/app");
const settings_1 = require("../../../src/common/config/settings");
const http_status_codes_1 = require("http-status-codes");
exports.blogsManagerTest = {
    createBlog() {
        return __awaiter(this, arguments, void 0, function* (data = 'default', accessToken) {
            if (data === 'default') {
                data = {
                    'name': 'string',
                    'description': 'string',
                    'websiteUrl': 'https://8aD.ru'
                };
            }
            const res = yield (0, supertest_1.agent)(app_1.app)
                .post(settings_1.SETTINGS.PATH.BLOGS)
                .send(data)
                .set({ authorization: `Bearer ${accessToken}` })
                .expect(http_status_codes_1.StatusCodes.CREATED);
            expect(res.body).toEqual({
                id: expect.any(String),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl,
                createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                isMembership: false
            });
            return res.body;
        });
    }
};
