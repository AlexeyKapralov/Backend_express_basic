import {db} from "../../../src/db/db";
import {MongoMemoryServer} from "mongodb-memory-server";
import {commentsManagerTest} from "./commentsManager.test";
import {agent} from "supertest";
import {app} from "../../../src/app";
import {SETTINGS} from "../../../src/common/config/settings";
import {postsManagerTest} from "../posts/postsManager";
import {IQueryModel} from "../../../src/common/types/query.model";
import {getCommentView} from "../../../src/common/utils/mappers";

describe('comments e2e tests', () => {

    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    beforeEach(async () => {
        await db.drop()
        await postsManagerTest.createPosts(1)
    })

    afterAll(async () => {
        await db.stop()
    })
    afterAll(done => {
        done()
    })

    it('should get empty array with default pagination', async () => {
        const posts = await db.getCollection().postsCollection.find().toArray()
        const result = await agent(app)
            .get(`${SETTINGS.PATH.POSTS}/${posts[0]._id}/comments`)

        expect(result.body).toEqual({
            "pagesCount": 0,
            "page": 1,
            "pageSize": 10,
            "totalCount": 0,
            "items": []
        })
    })

    it('should get comments array with custom pagination', async () => {
        const posts = await db.getCollection().postsCollection.find().toArray()
        await commentsManagerTest.createComments(25, posts[0]._id)
        const query:IQueryModel = {
            sortBy: 'content',
            sortDirection: 'asc',
            pageNumber: 2,
            pageSize: 4
        }
        const result = await agent(app)
            .get(`${SETTINGS.PATH.POSTS}/${posts[0]._id}/comments`)
            .query(query)

        const comments = await db.getCollection().commentsCollection.find()
            .sort(query.sortBy!, query.sortDirection!)
            .limit(query.pageSize!)
            .skip((query.pageNumber! - 1) * query.pageSize!)
            .toArray()

        const commentsCount = await db.getCollection().commentsCollection.countDocuments()

        expect(result.body).toEqual({
            "pagesCount": Math.ceil( commentsCount / query.pageSize! ),
            "page": query.pageNumber!,
            "pageSize": query.pageSize,
            "totalCount": commentsCount,
            "items": comments.map(i => getCommentView(i))
        })
    })
})