import {StatusCodes} from "http-status-codes";
import {agent as request} from "supertest"
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";

export const blogsTestManager = {
    async createBlog(data: any, admin_auth: string, httpStatusType = StatusCodes.CREATED) {

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
                websiteUrl: data.websiteUrl,
                createdAt: expect.any(String),
                isMembership: expect.any(Boolean)
            })
            expect(createdBlog.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/)
        }

        return {response, createdBlog}
    },

    async getBlogById(id: string) {
        const response = await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${id}`)
            .expect(StatusCodes.OK)

        expect(response.body).toEqual({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            websiteUrl: expect.any(String),
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean),
        })

        expect(response.body.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/)

        return response
    },

    async updateBlog(data: any, id: string, admin_auth: string, httpStatusType = StatusCodes.CREATED) {
        const buff2 = Buffer.from(admin_auth, 'utf8')
        const codedAuth = buff2.toString('base64')

        return await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${id}`)
            .set({'authorization': 'Basic ' + codedAuth})
            .send(data)
            .expect(httpStatusType)
    },
    async deleteBlog(id: string, admin_auth: string, httpStatusType = StatusCodes.NO_CONTENT) {
        const buff2 = Buffer.from(admin_auth, 'utf8')
        const codedAuth = buff2.toString('base64')

        const response = await request(app)
            .delete(`${SETTINGS.PATH.BLOGS}/${id}`)
            .set({'authorization': 'Basic ' + codedAuth})
            .expect(httpStatusType)

        return response.status === httpStatusType;

        // if (response.status === httpStatusType) {
        //     return true
        // } else {
        //     return false
        // }
    }
}