import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/db";
import {userManagerTest} from "../../e2e/users/userManager.test";
import {SETTINGS} from "../../../src/common/config/settings";
import {authManagerTest} from "../../e2e/auth/authManager.test";
import {loginService} from "../../../src/features/auth/service/login.service";
import {ResultStatus} from "../../../src/common/types/resultStatus.type";

describe('refresh Token integration test', () => {

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

    it('should refresh token', async () => {

        const inputData = {
            login: 'login',
            password: 'qwert1234',
            email: 'asdf@mail.ru'
        }

        await userManagerTest.createUser('default', SETTINGS.ADMIN_AUTH)
        const tokens = await authManagerTest.authUser({password: inputData.password, loginOrEmail: inputData.login})
        let newTokens = await loginService.refreshToken(tokens!.refreshToken)

        expect(newTokens!.data).not.toBe(tokens)
        expect(newTokens!.status).toBe(ResultStatus.Success)

    });

})