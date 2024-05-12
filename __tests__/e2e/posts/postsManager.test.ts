import {ObjectId} from 'mongodb'
import {db} from '../../../src/db/db'
import {IPostDbModel} from '../../../src/features/posts/models/postDb.model'
import {agent} from 'supertest'
import {app} from '../../../src/app'
import {SETTINGS} from '../../../src/common/config/settings'
import {StatusCodes} from 'http-status-codes'
import {IPostInputModel} from '../../../src/features/posts/models/postInput.model'
import {blogsManagerTest} from '../blogs/blogsManager.test'
import {IPostViewModel} from '../../../src/features/posts/models/postView.model'
import {IBlogViewModel} from '../../../src/features/blogs/models/blogView.model'
import {getRandomTitle} from '../../../src/common/utils/generators'


export const postsManagerTest = {
    async deletePost(id: string, accessToken: string, expectedStatus: StatusCodes = StatusCodes.NO_CONTENT) {

        await agent(app)
            .delete(`${SETTINGS.PATH.POSTS}/${id}`)
            .set({authorization: `Bearer ${accessToken}`})
            .expect(expectedStatus)

        expect(await db.getCollection().postsCollection.find({_id: id}).toArray()).toEqual([])
    },
    async createPosts(count: number) {
        for (let i = 0; i < count; i++) {

            let post: IPostDbModel = {
                _id: new ObjectId().toString(),
                title: getRandomTitle() + i,
                createdAt: new Date().toISOString(),
                blogId: i % 2 === 0 ? `generatedBlogId ${i + 1}` : `generatedBlogId ${i}`,
                blogName: i % 2 === 0 ? `generatedName ${i + 1}` : `generatedName ${i}`,
                content: `generated content ${i}`,
                shortDescription: `generated description ${i}`
            }

            await db.getCollection().postsCollection.insertOne(post)
        }
    },
    async createPost(
        requestBody: 'default' | IPostInputModel = 'default',
        accessToken: string,
        expectedStatus: StatusCodes = StatusCodes.CREATED,
        createdBlog: 'default' | IBlogViewModel = 'default'
    ): Promise<IPostViewModel | undefined> {
        if (createdBlog === 'default') {
            const blog = await blogsManagerTest.createBlog('default', accessToken)
            if (blog) {
                createdBlog = blog
            }
        }
        if (requestBody === 'default') {
            requestBody = {
                "title": "string",
                "shortDescription": "string",
                "content": "string",
                "blogId": createdBlog !== 'default' ? createdBlog.id : ''
            }
        }

        const res = await agent(app)
            .post(SETTINGS.PATH.POSTS)
            .send(requestBody)
            .set({authorization: `Bearer ${accessToken}`})
            .expect(expectedStatus)

        if (res.status === StatusCodes.CREATED) {
            expect(res.body).toEqual(
                {
                    'id': expect.any(String),
                    'title': expect.any(String),
                    'shortDescription': expect.any(String),
                    'content': expect.any(String),
                    'blogId': createdBlog !== 'default' ? createdBlog.id : '',
                    'blogName': createdBlog !== 'default' ? createdBlog.name : '',
                    'createdAt': expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
                }
            )
            return res.body
        }
        return undefined

    },
    async getPostById(id: string, expectedStatus: StatusCodes): Promise<IPostViewModel | undefined> {
        const result = await agent(app).get(SETTINGS.PATH.POSTS + '/' + id).expect(expectedStatus)

        if (result.status === StatusCodes.OK) {
            expect(result.body).toEqual(
                {
                    'id': id,
                    'title': expect.any(String),
                    'shortDescription': expect.any(String),
                    'content': expect.any(String),
                    'blogId': expect.any(String),
                    'blogName': expect.any(String),
                    'createdAt': expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                }
            )
            return result.body
        }
        return undefined
    },
    async updatePostById(id: string, accessToken: string, data: IPostInputModel, expectedStatus: StatusCodes = StatusCodes.NO_CONTENT) {
        await agent(app)
            .put(`${SETTINGS.PATH.POSTS}/${id}`)
            .set({authorization: `Bearer ${accessToken}`})
            .send(data)
            .expect(expectedStatus)
    }

}