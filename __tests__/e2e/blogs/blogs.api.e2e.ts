import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/db";
import {agent} from "supertest";
import {app} from "../../../src/app";

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
    //TODO: тесты для get post by blog id
    //TODO: тесты для create post by blog id
    //TODO: тесты для get blog by id
    //TODO: тесты для put blog by id
    //TODO: тесты для delete blog by id

    afterAll(async () => {
        db.stop()
    })

    afterAll(done => {
        done()
    })


})
