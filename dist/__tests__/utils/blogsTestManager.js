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
exports.blogsTestManager = void 0;
const http_status_codes_1 = require("http-status-codes");
const supertest_1 = require("supertest");
const app_1 = require("../../src/app");
const settings_1 = require("../../src/settings");
exports.blogsTestManager = {
    createBlog(data_1, admin_auth_1) {
        return __awaiter(this, arguments, void 0, function* (data, admin_auth, httpStatusType = http_status_codes_1.StatusCodes.CREATED) {
            const buff2 = Buffer.from(admin_auth, 'utf8');
            const codedAuth = buff2.toString('base64');
            const response = yield (0, supertest_1.agent)(app_1.app)
                .post(`${settings_1.SETTINGS.PATH.BLOGS}`)
                .set({ 'authorization': 'Basic ' + codedAuth })
                .send(data)
                .expect(httpStatusType);
            let createdBlog;
            if (httpStatusType === http_status_codes_1.StatusCodes.CREATED) {
                createdBlog = response.body;
                expect(createdBlog).toEqual({
                    id: expect.any(String),
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl
                });
            }
            return { response, createdBlog };
        });
    }
};
