import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/db";
import {agent} from "supertest";
import {app} from "../../../src/app";

describe('auth test', () => {
    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    it(`should get blogs with filter `, async () => {
        const res = await agent(app)
            .get('/')
            .expect('All is running!')
    })

    //TODO: тесты для post (positive + negative)

    afterAll(async () => {
        db.stop()
    })

    afterAll(done => {
        done()
    })
});