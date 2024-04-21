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
const supertest_1 = require("supertest");
const app_1 = require("../src/app");
const settings_1 = require("../src/settings");
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../src/db/db");
const mock_1 = require("../src/db/mock");
const postsTestsManager_1 = require("./test.services/postsTestsManager");
const mongodb_1 = require("mongodb");
describe('tests for posts blog', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app).delete(settings_1.SETTINGS.PATH.TEST_DELETE);
    }));
    it('should find all posts with default pagination', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app).get(settings_1.SETTINGS.PATH.POSTS).expect(http_status_codes_1.StatusCodes.NOT_FOUND);
    }));
    it('should add array and get blogs with default pagination fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const createdPosts = yield db_1.postsCollection.insertMany(mock_1.posts);
        if (createdPosts) {
            const res = yield (0, supertest_1.agent)(app_1.app)
                .get(settings_1.SETTINGS.PATH.POSTS)
                .expect(http_status_codes_1.StatusCodes.OK);
            expect(res.body).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 3,
                items: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        title: expect.any(String),
                        shortDescription: expect.any(String),
                        content: expect.any(String),
                        blogId: expect.any(String),
                        blogName: expect.any(String),
                        createdAt: expect.any(String)
                    })
                ])
            });
        }
    }));
    it("shouldn't create with incorrect data", () => __awaiter(void 0, void 0, void 0, function* () {
        const blog = {
            _id: String(new mongodb_1.ObjectId()),
            name: 'test blog',
            description: 'test blog description11',
            websiteUrl: 'test blog url11',
            createdAt: String(new Date().toISOString()),
            isMembership: true
        };
        yield db_1.blogsCollection.insertOne(blog);
        const body = {
            title: 'validvalidvalidvalidvalidvalidvalidvalid',
            content: 'validvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalid',
            blogId: blog._id,
            shortDescription: 'length_11-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx'
        };
        const res = yield postsTestsManager_1.postsTestsManager.createPost(body, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: 'title'
                },
                {
                    message: expect.any(String),
                    field: 'content'
                },
                {
                    message: expect.any(String),
                    field: 'shortDescription'
                }
            ]
        });
    }));
    it("shouldn't create with incorrect blog id", () => __awaiter(void 0, void 0, void 0, function* () {
        const body = {
            title: 'a',
            content: 'a',
            blogId: 'aa',
            shortDescription: 'a-a'
        };
        yield postsTestsManager_1.postsTestsManager.createPost(body, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.NOT_FOUND);
    }));
    it("shouldn't create post with no auth", () => __awaiter(void 0, void 0, void 0, function* () {
        const blog = {
            _id: String(new mongodb_1.ObjectId()),
            name: 'test blog',
            description: 'test blog description11',
            websiteUrl: 'test blog url11',
            createdAt: String(new Date().toISOString()),
            isMembership: true
        };
        yield db_1.blogsCollection.insertOne(blog);
        const body = {
            title: 'a',
            content: 'a',
            blogId: blog._id,
            shortDescription: 'length_11-a'
        };
        yield postsTestsManager_1.postsTestsManager.createPost(body, 'ss', http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }));
    it('should create post', () => __awaiter(void 0, void 0, void 0, function* () {
        const blog = {
            _id: String(new mongodb_1.ObjectId()),
            name: 'test blog',
            description: 'test blog description11',
            websiteUrl: 'test blog url11',
            createdAt: String(new Date().toISOString()),
            isMembership: true
        };
        yield db_1.blogsCollection.insertOne(blog);
        const body = {
            title: 'a',
            content: 'a',
            blogId: blog._id,
            shortDescription: 'length_11-a'
        };
        const res = yield postsTestsManager_1.postsTestsManager.createPost(body, settings_1.SETTINGS.ADMIN_AUTH, http_status_codes_1.StatusCodes.CREATED);
        expect(res.body).toEqual({
            id: expect.any(String),
            title: 'a',
            content: 'a',
            blogId: blog._id,
            blogName: expect.any(String),
            shortDescription: 'length_11-a',
            createdAt: expect.any(String)
        });
    }));
});
