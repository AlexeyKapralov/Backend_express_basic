import {IBlogInputModel} from '../../../src/features/blogs/models/blogInput.model'
import {agent} from 'supertest'
import {app} from '../../../src/app'
import {SETTINGS} from '../../../src/common/config/settings'
import {StatusCodes} from 'http-status-codes'
import {ObjectId} from 'mongodb'
import {db} from '../../../src/db/db'
import {IBlogDbModel} from '../../../src/features/blogs/models/blogDb.model'
import {getRandomTitle} from '../../../src/common/utils/generators'
import {IBlogViewModel} from "../../../src/features/blogs/models/blogView.model";
import {PATH} from "../../../src/common/config/path";

export const blogsManagerTest = {
    async createBlog(
        data: IBlogInputModel | 'default' = 'default',
		accessToken: string,
		expectedStatus: StatusCodes = StatusCodes.CREATED
	): Promise<IBlogViewModel> {
        if (data === 'default') {
            data = {
                'name': 'string',
                'description': 'string',
                'websiteUrl': 'https://8aD.ru'
            }
        }

        const res = await agent(app)
            .post(PATH.BLOGS)
            .send(data)
            .set({authorization: `Bearer ${accessToken}`})
            .expect(expectedStatus)

        if (res.status === StatusCodes.CREATED) {
            expect(res.body).toEqual({
                id: expect.any(String),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl,
                createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                isMembership: false
            })
        }

        return res.body
    },
    async createBlogs(count: number) {
        for (let i = 0; i < count; i++) {

            const randomTitle = getRandomTitle() + 'i'
            let blog: IBlogDbModel = {
                _id: new ObjectId().toString(),
                name: getRandomTitle() + 'i',
                isMembership: true,
                websiteUrl: randomTitle + '.com',
                description: randomTitle + ' : description about it',
                createdAt: new Date().toISOString(),
            }

            await db.getCollection().blogsCollection.insertOne(blog)
        }
    }
}