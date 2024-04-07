import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {HTTP_STATUSES} from "../../src/utils/utils";
import {PostViewModel} from "../../src/features/posts/models/PostViewModel";
import {BlogType} from "../../src/db/db";
import {PostInputModel} from "../../src/features/posts/models/PostInputModel";
import {blogsTestManager} from "../utils/blogsTestManager";
import {postsTestManager} from "../utils/postsTestManager";

const request = require('supertest');

describe('', () => {
    beforeAll(async () => {
        await request(app).delete(`${SETTINGS.PATH.TESTS}`)
    })

    it('should get posts', async () => {
        await request(app)
            .get(`${SETTINGS.PATH.POSTS}`)
            .expect(HTTP_STATUSES.OK_200)
            .expect([])
    });

    let createdBlogGlobal: BlogType
    it(`should create blog`, async () => {
        const newBlog = {
            name: "123",
            description: "string",
            websiteUrl: "https://google.com"
        }
        const {createdBlog} = await blogsTestManager.createBlog(newBlog, SETTINGS.ADMIN_AUTH)
        createdBlogGlobal = createdBlog
    })

    let createdPostGlobal: PostViewModel
    it(`shouldn't create post with incorrect blogId`, async () => {

        const data: PostInputModel = {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: "id_blo1"
        }

        const {response} = await postsTestManager.createPost(data, SETTINGS.ADMIN_AUTH, HTTP_STATUSES.BAD_REQUEST_400)

        expect(response.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "blogId"
                }
            ]
        })

        await request(app)
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.OK_200, [])
    });

    it(`shouldn't create post with incorrect data`, async () => {

        const data = {
            title: "stringasdasdasdasdasstringasdasdasdasdas",
            shortDescription: "",
            content: '',
            blogId: 'asdasd'
        }

        const {response} = await postsTestManager.createPost(data, SETTINGS.ADMIN_AUTH, HTTP_STATUSES.BAD_REQUEST_400)

        expect(response.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "title"
                },
                {
                    message: expect.any(String),
                    field: "shortDescription"
                },
                {
                    message: expect.any(String),
                    field: "content"
                },
                {
                    message: expect.any(String),
                    field: "blogId"
                }
            ]
        })
    });

    it(`should create post with correct blogId`, async () => {

        const data: PostInputModel = {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: createdBlogGlobal.id
        }


        const {createdPost} = await postsTestManager.createPost(data, SETTINGS.ADMIN_AUTH)

        if (createdPost) {
            createdPostGlobal = createdPost
        } else {
            expect(createdPost).toEqual(undefined)
        }

        await request(app)
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.OK_200, [createdPostGlobal])
    })

});