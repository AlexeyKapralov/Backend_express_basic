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
const settings_1 = require("../../src/settings");
const app_1 = require("../../src/app");
const utils_1 = require("../../src/utils/utils");
const request = require('supertest');
exports.blogsTestManager = {
    createBlog(data_1, admin_auth_1) {
        return __awaiter(this, arguments, void 0, function* (data, admin_auth, httpStatusType = utils_1.HTTP_STATUSES.CREATED_201) {
            const buff2 = Buffer.from(admin_auth, 'utf8');
            const codedAuth = buff2.toString('base64');
            const response = yield request(app_1.app)
                .post(`${settings_1.SETTINGS.PATH.POSTS}`)
                .set({ 'authorization': 'Basic ' + codedAuth })
                .send(data)
                .expect(httpStatusType);
            let createdBlog;
            if (httpStatusType === utils_1.HTTP_STATUSES.CREATED_201) {
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
    },
    updateBlog(id_1, data_1, admin_auth_1) {
        return __awaiter(this, arguments, void 0, function* (id, data, admin_auth, expectedStatus = utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            const buff2 = Buffer.from(admin_auth, 'utf8');
            const codedAuth = buff2.toString('base64');
            const updatedBlog = {
                id: id,
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            };
            const response = yield request(app_1.app)
                .put(`${settings_1.SETTINGS.PATH.BLOGS}/${id}`)
                .set({ 'authorization': 'Basic ' + codedAuth })
                .send(data)
                .expect(expectedStatus);
            if (response.status === utils_1.HTTP_STATUSES.NO_CONTENT_204) {
                return { response, updatedBlog };
            }
            else {
                return { response };
            }
        });
    },
    deleteBlog(id, admin_auth, expectedStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const buff2 = Buffer.from(admin_auth, 'utf8');
            const codedAuth = buff2.toString('base64');
            yield request(app_1.app)
                .delete(`${settings_1.SETTINGS.PATH.BLOGS}/${id}`)
                .set({ 'authorization': 'Basic ' + codedAuth })
                .expect(expectedStatus);
            return true;
        });
    }
};
