import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {agent} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/common/config/settings";

describe('blogs tests', () => {
    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    // it(`should get blogs with filter `, async () => {
    //     const res = await agent(app)
    //         .get(SETTINGS.PATH.BLOGS)
    //         .query({searchNameTerm: '1'})
    //
    // })


    afterAll(async () => {
        db.stop()
    })

    afterAll(done => {
        done()
    })


})
