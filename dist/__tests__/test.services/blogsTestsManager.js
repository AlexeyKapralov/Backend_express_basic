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
exports.blogsTestsManager = void 0;
const http_status_codes_1 = require("http-status-codes");
const settings_1 = require("../../src/settings");
const supertest_1 = require("supertest");
const app_1 = require("../../src/app");
const db_1 = require("../../src/db/db");
const posts_repository_1 = require("../../src/repositories/posts.repository");
exports.blogsTestsManager = {
    getBlogById(blogId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, supertest_1.agent)(app_1.app)
                .get(settings_1.SETTINGS.PATH.BLOGS + '/' + blogId)
                .expect(status);
            return res;
        });
    },
    createBlog(body_1, auth_1) {
        return __awaiter(this, arguments, void 0, function* (body, auth, httpStatusType = http_status_codes_1.StatusCodes.CREATED) {
            const buff = Buffer.from(auth, 'utf-8');
            const decodedAuth = buff.toString('base64');
            // запрос на создание нового блога
            const res = yield (0, supertest_1.agent)(app_1.app)
                .post(settings_1.SETTINGS.PATH.BLOGS)
                .set({ authorization: `Basic ${decodedAuth}` })
                .send(body)
                .expect(httpStatusType);
            if (httpStatusType === http_status_codes_1.StatusCodes.CREATED) {
                // проверка созданного блога
                expect(res.body).toEqual({
                    id: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    websiteUrl: expect.any(String),
                    createdAt: expect.any(String),
                    isMembership: expect.any(Boolean)
                });
                expect(res.body.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/);
            }
            return res;
        });
    },
    updateBlog(id_1, body_1, auth_1) {
        return __awaiter(this, arguments, void 0, function* (id, body, auth, httpStatusType = http_status_codes_1.StatusCodes.CREATED) {
            const buff = Buffer.from(auth, 'utf-8');
            const decodedAuth = buff.toString('base64');
            // запрос на создание нового блога
            const res = yield (0, supertest_1.agent)(app_1.app)
                .put(settings_1.SETTINGS.PATH.BLOGS + '/' + id)
                .set({ authorization: `Basic ${decodedAuth}` })
                .send(body)
                .expect(httpStatusType);
            return res;
        });
    },
    deleteBlog(id_1, auth_1) {
        return __awaiter(this, arguments, void 0, function* (id, auth, httpStatusType = http_status_codes_1.StatusCodes.NO_CONTENT) {
            const buff = Buffer.from(auth, 'utf-8');
            const decodedAuth = buff.toString('base64');
            const res = yield (0, supertest_1.agent)(app_1.app)
                .delete(settings_1.SETTINGS.PATH.BLOGS + '/' + id)
                .set({ authorization: `Basic ${decodedAuth}` })
                .expect(httpStatusType);
            return res;
        });
    },
    createPostForBlog(id_1, body_1, auth_1) {
        return __awaiter(this, arguments, void 0, function* (id, body, auth, expected_status_code = http_status_codes_1.StatusCodes.CREATED) {
            const blog = yield db_1.blogsCollection.findOne({
                _id: id
            });
            if (blog !== null) {
                const buff = Buffer.from(auth, 'utf-8');
                const decodedAuth = buff.toString('base64');
                const res = yield (0, supertest_1.agent)(app_1.app)
                    .post(settings_1.SETTINGS.PATH.BLOGS + '/' + id + '/posts')
                    .set({ authorization: `Basic ${decodedAuth}` })
                    .send(body)
                    .expect(expected_status_code);
                return { blog, res };
            }
        });
    },
    getPostsByBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield posts_repository_1.postRepository.getPostsByBlogId(id);
        });
    }
};
