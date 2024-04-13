import {agent as request} from "supertest";
import {app} from "../../src/app";
import {blogsTestManager} from "../utils/blogsTestManager";
import {SETTINGS} from "../../src/settings";

describe('', () => {
    it('should get version', async () => {
        await request(app)
            .get('/')
            .expect({version: '1'})
    })

    it('should create blog', async () => {

        const data = {name: "new blog", websiteUrl: "https://someurl.com", description: "description"}

        await blogsTestManager.createBlog(data, SETTINGS.ADMIN_AUTH)
    })
})