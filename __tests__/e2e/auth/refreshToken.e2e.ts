import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/db";
import {app} from "../../../src/app";
import {agent} from "supertest";

describe('refresh Token e2e test', ()=>{

    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })
    beforeEach(async ()=> {
        await db.drop()
    })

    afterAll(async () => {
        await db.stop()
    })

    afterAll(done => {
        done()
    })

    it.skip('should refresh token', () => {
        agent(app)
            .post(`/auth/refresh-token`)
    });

})