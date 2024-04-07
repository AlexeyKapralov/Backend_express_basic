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
exports.postsTestManager = void 0;
const app_1 = require("../../src/app");
const settings_1 = require("../../src/settings");
const utils_1 = require("../../src/utils/utils");
const request = require('supertest');
exports.postsTestManager = {
    createPost(data_1, admin_auth_1) {
        return __awaiter(this, arguments, void 0, function* (data, admin_auth, httpStatusType = utils_1.HTTP_STATUSES.CREATED_201) {
            const buff2 = Buffer.from(admin_auth, 'utf8');
            const codedAuth = buff2.toString('base64');
            const response = yield request(app_1.app)
                .post(`${settings_1.SETTINGS.PATH.POSTS}`)
                .set({ 'authorization': 'Basic ' + codedAuth })
                .send(data)
                .expect(httpStatusType);
            let createdPost;
            if (httpStatusType === utils_1.HTTP_STATUSES.CREATED_201) {
                createdPost = response.body;
                expect(createdPost).toEqual({
                    id: expect.any(String),
                    title: data.title,
                    content: data.content,
                    blogId: data.blogId,
                    blogName: createdPost.blogName,
                    shortDescription: data.shortDescription,
                });
            }
            return { response, createdPost };
        });
    }
};
