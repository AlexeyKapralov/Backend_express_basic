import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {HTTP_STATUSES} from "../../src/utils/utils";
import {blogsTestManager} from "../utils/blogsTestManager";
import {BlogViewModel} from "../../src/features/blogs/models/BlogViewModel";
import {BlogType} from "../../src/db/db";

const request = require('supertest');

describe('', () => {
    beforeAll(async () => {
        await request(app).delete(`${SETTINGS.PATH.TESTS}`)
    })

    it('should get blogs', async () => {
        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}`)
            .expect(HTTP_STATUSES.OK_200)
            .expect([])
    });

    let createdBlogGlobal: BlogViewModel
    it('should create blog', async () => {

        const data = {
            name: "123",
            description: "string",
            websiteUrl: "https://google.com"
        }

        const {createdBlog} = await blogsTestManager.createBlog(data, SETTINGS.ADMIN_AUTH)

        createdBlogGlobal = createdBlog

        await request(app)
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_STATUSES.OK_200, [createdBlogGlobal])
    });

    it(`shouldn't create blog with incorrect data`, async () => {

        const data = {
            name: "strinasdasdasdasdasdasdasdadsadasdasdasdg",
            description: "asd",
            websiteUrl: "https://google.comdasdasd"
        }

        const {response} = await blogsTestManager.createBlog(data, SETTINGS.ADMIN_AUTH, HTTP_STATUSES.BAD_REQUEST_400)

        return expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400)
    });

    it('should find blog by id', async () => {
        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${createdBlogGlobal.id}`)
            .expect(HTTP_STATUSES.OK_200, createdBlogGlobal)
    });

    it(`shouldn't find blog by id`, async () => {
        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/adzxafqwr`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });

    it('should update blog with correct data', async () => {

        const BlogForUpdate = {
            name: "new Name",
            description: "new Description",
            websiteUrl: "https://newSite.com"
        }

        const {response} = await blogsTestManager.updateBlog(createdBlogGlobal.id, BlogForUpdate, SETTINGS.ADMIN_AUTH, HTTP_STATUSES.NO_CONTENT_204)

        return expect(response.status).toBe(HTTP_STATUSES.NO_CONTENT_204)
    });

    let updatedBlogGlobal: BlogType
    it(`shouldn't update blog with incorrect data`, async () => {

        const BlogForUpdate = {
            name: "new Nameasdasdadsad",
            description: "new Description",
            websiteUrl: "https://newSiteasdadasdascom"
        }

        const {
            response,
            updatedBlog
        } = await blogsTestManager.updateBlog(createdBlogGlobal.id, BlogForUpdate, SETTINGS.ADMIN_AUTH, HTTP_STATUSES.BAD_REQUEST_400)

        updatedBlogGlobal = updatedBlog

        return expect(response.status).toBe(HTTP_STATUSES.BAD_REQUEST_400)
    });

    it('should delete blog', async () => {

        await blogsTestManager
            .deleteBlog(updatedBlogGlobal.id, SETTINGS.ADMIN_AUTH, HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}`)
            .expect(HTTP_STATUSES.OK_200)
            .expect([])
    });

});