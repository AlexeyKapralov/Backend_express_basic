import {SETTINGS} from "../../src/settings";
import {app} from "../../src/app";
import {HTTP_STATUSES, HttpStatusType} from "../../src/utils/utils";
import {BlogInputModel} from "../../src/features/blogs/models/BlogInputModel";
import {BlogType} from "../../src/db/db";

const request = require('supertest');

export const blogsTestManager = {
    async createBlog(data: BlogInputModel, admin_auth: string, httpStatusType = HTTP_STATUSES.CREATED_201) {

        const buff2 = Buffer.from(admin_auth, 'utf8')
        const codedAuth = buff2.toString('base64')


        const response = await request(app)
            .post(`${SETTINGS.PATH.BLOGS}`)
            .set({'authorization': 'Basic ' + codedAuth})
            .send(data)
            .expect(httpStatusType)

        let createdBlog

        if (httpStatusType === HTTP_STATUSES.CREATED_201) {
            createdBlog = response.body
            expect(createdBlog).toEqual({
                id: expect.any(String),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            })
        }

        return {response, createdBlog}
    },

    async updateBlog(id: string, data: BlogInputModel, admin_auth: string, expectedStatus: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {

        const buff2 = Buffer.from(admin_auth, 'utf8')
        const codedAuth = buff2.toString('base64')

        const updatedBlog: BlogType = {
            id: id,
            websiteUrl: data.websiteUrl,
            description: data.description,
            name: data.name
        }

        const response = await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${id}`)
            .set({'authorization': 'Basic ' + codedAuth})
            .send(data)
            .expect(expectedStatus)

        return {response, updatedBlog}
    },

    async deleteBlog(id: string, admin_auth: string, expectedStatus: HttpStatusType) {

        const buff2 = Buffer.from(admin_auth, 'utf8')
        const codedAuth = buff2.toString('base64')

        await request(app)
            .delete(`${SETTINGS.PATH.BLOGS}/${id}`)
            .set({'authorization': 'Basic ' + codedAuth})
            .expect(expectedStatus)

        return true
    }
}