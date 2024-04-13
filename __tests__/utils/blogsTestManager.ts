import {BlogInputModelType} from "../../src/features/blogs/models/blogInputModelType";
import {StatusCodes} from "http-status-codes";
import {agent as request} from "supertest"
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";

export const blogsTestManager = {
    async createBlog(data: BlogInputModelType, admin_auth: string, httpStatusType = StatusCodes.CREATED) {

        const buff2 = Buffer.from(admin_auth, 'utf8')
        const codedAuth = buff2.toString('base64')


        const response = await request(app)
            .post(`${SETTINGS.PATH.BLOGS}`)
            .set({'authorization': 'Basic ' + codedAuth})
            .send(data)
            .expect(httpStatusType)

        let createdBlog

        if (httpStatusType === StatusCodes.CREATED) {
            createdBlog = response.body
            expect(createdBlog).toEqual({
                id: expect.any(String),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            })
        }

        return {response, createdBlog}
    }
}