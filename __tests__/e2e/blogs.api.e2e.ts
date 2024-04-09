import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {HTTP_STATUSES} from "../../src/utils/utils";
import {BlogType} from "../../src/db/db";
import {blogsTestManager} from "../utils/blogsTestManager";
import {BlogViewModel} from "../../src/features/blogs/models/BlogViewModel";
import {agent as request} from "supertest";

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

        //или прямо из бд
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

    let updatedBlogGlobal: BlogType
    it('should update blog with correct data', async () => {

        const BlogForUpdate = {
            name: "new Name",
            description: "new Description",
            websiteUrl: "https://newSite.com"
        }

        const {updatedBlog} = await blogsTestManager.updateBlog(createdBlogGlobal.id, BlogForUpdate, SETTINGS.ADMIN_AUTH, HTTP_STATUSES.NO_CONTENT_204)

        if (updatedBlog) {
            updatedBlogGlobal = updatedBlog
        }

        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}`)
            .expect(HTTP_STATUSES.OK_200)
            .expect([updatedBlogGlobal])
    });


    it(`shouldn't update blog with incorrect data`, async () => {

        const BlogForUpdate = {
            name: "new Nameasdasdadsad",
            description: "new Description",
            websiteUrl: "https://newSiteasdadasdascom"
        }

        const {
            updatedBlog
        } = await blogsTestManager.updateBlog(createdBlogGlobal.id, BlogForUpdate, SETTINGS.ADMIN_AUTH, HTTP_STATUSES.BAD_REQUEST_400)

        if (updatedBlog) {
            updatedBlogGlobal = updatedBlog
        }

        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}`)
            .expect(HTTP_STATUSES.OK_200)
            .expect([updatedBlogGlobal])
    });

    it(`shouldn't delete blog with unknown id `, async () => {

        await blogsTestManager
            .deleteBlog('xzcaqwe', SETTINGS.ADMIN_AUTH, HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}`)
            .expect(HTTP_STATUSES.OK_200)
            .expect([updatedBlogGlobal])
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