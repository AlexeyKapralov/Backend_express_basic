import {authManagerTest} from "../../e2e/auth/authManager.test";
import {loginService} from "../../../src/features/auth/service/login.service";
import {ResultStatus} from "../../../src/common/types/resultStatus.type";
import {db} from "../../../src/db/db";
import {MongoMemoryServer} from "mongodb-memory-server";
import {userManagerTest} from "../../e2e/users/userManager.test";
import {SETTINGS} from "../../../src/common/config/settings";

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

        expect(isLogout.status).toBe(ResultStatus.Unauthorized)
    });

    it('should logout user', async () => {
        const tokens = await authManagerTest.createAndAuthUser()


        if (tokens) {
            const isLogout = await loginService.logout(tokens.refreshToken)
            expect(isLogout.status).toBe(ResultStatus.Success)
        }
    });

    it(`shouldn't refresh token if token was logout`, async () => {
        const tokens = await authManagerTest.createAndAuthUser()


        if (tokens) {
            const isLogout = await loginService.logout(tokens.refreshToken)

            const refreshTokens = await loginService.refreshToken(tokens.refreshToken)

            expect(refreshTokens.status).toBe(ResultStatus.Unauthorized)
            expect(isLogout.status).toBe(ResultStatus.Success)
        }
    })
    it('should logout and error if try refresh token with old token', async () => {

        const inputData = {
            loginOrEmail: 'login',
            password: 'qwert1234',
        }

        await userManagerTest.createUser('default', SETTINGS.ADMIN_AUTH)
        const tokens = await authManagerTest.authUser(inputData)
        await new Promise(resolve => setTimeout(resolve, 1000))
        const newTokens = await loginService.refreshToken(tokens!.refreshToken)

        expect(tokens!.refreshToken).not.toBe(newTokens.data!.refreshToken)

        let isRefreshed = await loginService.refreshToken(tokens!.refreshToken)

        expect(isRefreshed!.status).toBe(ResultStatus.Unauthorized)

        const result = await loginService.logout(tokens!.refreshToken)
        expect(result.status).toBe(ResultStatus.Unauthorized)

    });
})