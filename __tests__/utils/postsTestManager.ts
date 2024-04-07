import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {HTTP_STATUSES, HttpStatusType} from "../../src/utils/utils";
import {PostInputModel} from "../../src/features/posts/models/PostInputModel";

const request = require('supertest')

export const postsTestManager = {
    async createPost(data:PostInputModel, admin_auth: string, httpStatusType: HttpStatusType = HTTP_STATUSES.CREATED_201) {

        const buff2 = Buffer.from(admin_auth, 'utf8');
        const codedAuth = buff2.toString('base64');

        const response = await request(app)
            .post(`${SETTINGS.PATH.POSTS}`)
            .set({'authorization': 'Basic ' + codedAuth})
            .send(data)
            .expect(httpStatusType);

        let createdPost;

        if (httpStatusType === HTTP_STATUSES.CREATED_201) {
            createdPost = response.body;
            expect(createdPost).toEqual({
                id: expect.any(String),
                title: data.title,
                content: data.content,
                blogId: data.blogId,
                blogName: createdPost.blogName,
                shortDescription: data.shortDescription,
            });
        }
        return {response, createdPost};
    }
};