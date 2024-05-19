import {authManagerTest} from "../../e2e/auth/authManager.test";
import {loginService} from "../../../src/service/login.service";
import {ResultStatus} from "../../../src/common/types/resultStatus.type";
import {db} from "../../../src/db/db";
import {MongoMemoryServer} from "mongodb-memory-server";

describe('logout user integration test', () => {
    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    beforeEach(async () => {
        await db.drop()
    })

    afterAll(async () => {
        await db.stop()
    })

    afterAll(done => {
        done()
    })

    it(`shouldn't logout user with incorrect token`, async () => {


            const isLogout = await loginService.logout('123')
            const isBlocked = await db.getCollection().blockListCollection.findOne({refreshToken: '123'})


            expect(isBlocked).toBe(null)
            expect(isLogout.status).toBe(ResultStatus.NotFound)
    });

    it('should logout user', async () => {
        await authManagerTest.createAndAuthUser()

        const result = await authManagerTest.authUser()

        if (result) {
            const isLogout = await loginService.logout(result.refreshToken)
            const isBlocked = await db.getCollection().blockListCollection.findOne({refreshToken: result.refreshToken})


            expect(isBlocked).not.toBe(null)
            expect(isLogout.status).toBe(ResultStatus.Success)
        }
    });
})