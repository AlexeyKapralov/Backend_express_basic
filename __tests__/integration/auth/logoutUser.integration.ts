import {authManagerTest} from "../../e2e/auth/authManager.test";
import {authService} from "../../../src/features/auth/service/auth.service";
import {ResultStatus} from "../../../src/common/types/resultStatus.type";
import {db} from "../../../src/db/db";
import {MongoMemoryServer} from "mongodb-memory-server";
import {userManagerTest} from "../../e2e/users/userManager.test";
import {SETTINGS} from "../../../src/common/config/settings";
import {jwtService} from "../../../src/common/adapters/jwt.service";

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

        const isLogout = await authService.logout('123', '1234', 10)

        expect(isLogout.status).toBe(ResultStatus.Unauthorized)
    });

    it('should logout user', async () => {
        const tokens = await authManagerTest.createAndAuthUser()


        if (tokens) {
            const tokenPayload = jwtService.verifyAndDecodeToken(tokens.refreshToken)
            const logoutResult = await authService.logout(tokenPayload!.deviceId, tokenPayload!.userId, tokenPayload!.iat)
            expect(logoutResult.status).toBe(ResultStatus.Success)
        }
    });

    it(`shouldn't refresh token if token was logout`, async () => {
        const tokens = await authManagerTest.createAndAuthUser()


        if (tokens) {

            const tokenPayload = jwtService.verifyAndDecodeToken(tokens!.refreshToken)
            const isLogout = await authService.logout(tokenPayload!.deviceId, tokenPayload!.userId, tokenPayload!.iat)

            const refreshTokens = await authService.refreshToken(tokenPayload!.deviceId, tokenPayload!.userId, tokenPayload!.iat)

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

        const tokens1 = await authManagerTest.authUser(inputData)
        const tokenPayload1 = jwtService.verifyAndDecodeToken(tokens1!.refreshToken)


        await new Promise(resolve => setTimeout(resolve, 1000))

        const tokens2 = await authService.refreshToken(tokenPayload1!.deviceId, tokenPayload1!.userId, tokenPayload1!.iat)
        const tokenPayload2 = jwtService.verifyAndDecodeToken(tokens2.data!.refreshToken)
        expect(tokens1!.refreshToken).not.toBe(tokens2.data!.refreshToken)


        await new Promise(resolve => setTimeout(resolve, 1000))

        const tokens2Repeat = await authService.refreshToken(tokenPayload1!.deviceId, tokenPayload1!.userId, tokenPayload1!.iat)

        const tokens3 = await authService.refreshToken(tokenPayload2!.deviceId, tokenPayload2!.userId, tokenPayload2!.iat)

        const tokenPayload3 = jwtService.verifyAndDecodeToken(tokens3.data!.refreshToken)

        expect(tokens2Repeat!.status).toBe(ResultStatus.Unauthorized)
        expect(tokens3!.status).toBe(ResultStatus.Success)

        const logoutResult1 = await authService.logout(tokenPayload1!.deviceId, tokenPayload1!.userId, tokenPayload1!.iat)
        const logoutResult2 = await authService.logout(tokenPayload2!.deviceId, tokenPayload2!.userId, tokenPayload2!.iat)
        const logoutResult3 = await authService.logout(tokenPayload3!.deviceId, tokenPayload3!.userId, tokenPayload3!.iat)

        expect(logoutResult1.status).toBe(ResultStatus.Unauthorized)
        expect(logoutResult2.status).toBe(ResultStatus.Unauthorized)
        expect(logoutResult3.status).toBe(ResultStatus.Success)
    });
})