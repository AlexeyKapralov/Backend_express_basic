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
exports.postsManagerTest = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../../src/db/db");
const supertest_1 = require("supertest");
const app_1 = require("../../../src/app");
const settings_1 = require("../../../src/common/config/settings");
const http_status_codes_1 = require("http-status-codes");
const blogsManager_test_1 = require("../blogs/blogsManager.test");
const generators_1 = require("../../../src/common/utils/generators");
exports.postsManagerTest = {
    deletePost(id_1, accessToken_1) {
        return __awaiter(this, arguments, void 0, function* (id, accessToken, expectedStatus = http_status_codes_1.StatusCodes.NO_CONTENT) {
            yield (0, supertest_1.agent)(app_1.app)
                .delete(`${settings_1.SETTINGS.PATH.POSTS}/${id}`)
                .set({ authorization: `Bearer ${accessToken}` })
                .expect(expectedStatus);
            expect(yield db_1.db.getCollection().postsCollection.find({ _id: id }).toArray()).toEqual([]);
        });
    },
    createPosts(count) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < count; i++) {
                let post = {
                    _id: new mongodb_1.ObjectId().toString(),
                    title: (0, generators_1.getRandomTitle)() + i,
                    createdAt: new Date().toISOString(),
                    blogId: i % 2 === 0 ? `generatedBlogId ${i + 1}` : `generatedBlogId ${i}`,
                    blogName: i % 2 === 0 ? `generatedName ${i + 1}` : `generatedName ${i}`,
                    content: `generated content ${i}`,
                    shortDescription: `generated description ${i}`
                };
                yield db_1.db.getCollection().postsCollection.insertOne(post);
            }
        });
    },
    createPost() {
        return __awaiter(this, arguments, void 0, function* (requestBody = 'default', accessToken, expectedStatus = http_status_codes_1.StatusCodes.CREATED, createdBlog = 'default') {
            if (createdBlog === 'default') {
                const blog = yield blogsManager_test_1.blogsManagerTest.createBlog('default', accessToken);
                if (blog) {
                    createdBlog = blog;
                }
            }
            if (requestBody === 'default') {
                requestBody = {
                    "title": "string",
                    "shortDescription": "string",
                    "content": "string",
                    "blogId": createdBlog !== 'default' ? createdBlog.id : ''
                };
            }
            const res = yield (0, supertest_1.agent)(app_1.app)
                .post(settings_1.SETTINGS.PATH.POSTS)
                .send(requestBody)
                .set({ authorization: `Bearer ${accessToken}` })
                .expect(expectedStatus);
            if (res.status === http_status_codes_1.StatusCodes.CREATED) {
                expect(res.body).toEqual({
                    'id': expect.any(String),
                    'title': expect.any(String),
                    'shortDescription': expect.any(String),
                    'content': expect.any(String),
                    'blogId': createdBlog !== 'default' ? createdBlog.id : '',
                    'blogName': createdBlog !== 'default' ? createdBlog.name : '',
                    'createdAt': expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
                });
                return res.body;
            }
            return undefined;
        });
    },
    getPostById(id, expectedStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, supertest_1.agent)(app_1.app).get(settings_1.SETTINGS.PATH.POSTS + '/' + id).expect(expectedStatus);
            if (result.status === http_status_codes_1.StatusCodes.OK) {
                expect(result.body).toEqual({
                    'id': id,
                    'title': expect.any(String),
                    'shortDescription': expect.any(String),
                    'content': expect.any(String),
                    'blogId': expect.any(String),
                    'blogName': expect.any(String),
                    'createdAt': expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                });
                return result.body;
            }
            return undefined;
        });
    },
    updatePostById(id_1, accessToken_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (id, accessToken, data, expectedStatus = http_status_codes_1.StatusCodes.NO_CONTENT) {
            yield (0, supertest_1.agent)(app_1.app)
                .put(`${settings_1.SETTINGS.PATH.POSTS}/${id}`)
                .set({ authorization: `Bearer ${accessToken}` })
                .send(data)
                .expect(expectedStatus);
        });
    }
};
