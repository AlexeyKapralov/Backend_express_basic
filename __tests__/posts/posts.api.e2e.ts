import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {agent} from "supertest";
import {app} from "../../src/app";

describe('blogs tests', () => {
    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    it(`should get blogs with filter `, async () => {
        const res = await agent(app)
            .get('/')
            .expect('All is running!')
        // .get(SETTINGS.PATH.BLOGS)
    })

    //TODO: тесты для get (default pagination + custom)
    //TODO: тесты для post (positive + negative)
    //TODO: тесты для get post by id
    //TODO: тесты для put post by id
    //TODO: тесты для delete post by id

    afterAll(async () => {
        db.stop()
    })

    afterAll(done => {
        done()
    })


})
