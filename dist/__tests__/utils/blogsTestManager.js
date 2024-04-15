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
                    websiteUrl: data.websiteUrl,
                    createdAt: expect.any(String),
                    isMembership: expect.any(Boolean)
                });
                expect(createdBlog.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/);
            }
            return { response, createdBlog };
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, supertest_1.agent)(app_1.app)
                .get(`${settings_1.SETTINGS.PATH.BLOGS}/${id}`)
                .expect(http_status_codes_1.StatusCodes.OK);
            expect(response.body).toEqual({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                websiteUrl: expect.any(String),
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean),
            });
            expect(response.body.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/);
            return response;
        });
    },
    updateBlog(data_1, id_1, admin_auth_1) {
        return __awaiter(this, arguments, void 0, function* (data, id, admin_auth, httpStatusType = http_status_codes_1.StatusCodes.CREATED) {
            const buff2 = Buffer.from(admin_auth, 'utf8');
            const codedAuth = buff2.toString('base64');
            return yield (0, supertest_1.agent)(app_1.app)
                .put(`${settings_1.SETTINGS.PATH.BLOGS}/${id}`)
                .set({ 'authorization': 'Basic ' + codedAuth })
                .send(data)
                .expect(httpStatusType);
        });
    },
    deleteBlog(id_1, admin_auth_1) {
        return __awaiter(this, arguments, void 0, function* (id, admin_auth, httpStatusType = http_status_codes_1.StatusCodes.NO_CONTENT) {
            const buff2 = Buffer.from(admin_auth, 'utf8');
            const codedAuth = buff2.toString('base64');
            const response = yield (0, supertest_1.agent)(app_1.app)
                .delete(`${settings_1.SETTINGS.PATH.BLOGS}/${id}`)
                .set({ 'authorization': 'Basic ' + codedAuth })
                .expect(httpStatusType);
            return response.status === httpStatusType;
            // if (response.status === httpStatusType) {
            //     return true
            // } else {
            //     return false
            // }
        });
    }
};
