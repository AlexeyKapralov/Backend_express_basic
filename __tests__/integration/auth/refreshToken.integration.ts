import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/db";
import {userManagerTest} from "../../e2e/users/userManager.test";
import {SETTINGS} from "../../../src/common/config/settings";
import {authManagerTest} from "../../e2e/auth/authManager.test";
import {ResultStatus} from "../../../src/common/types/resultStatus.type";
import {JwtService} from "../../../src/common/adapters/jwtService";
import {container} from "../../../src/ioc";
import {AuthService} from "../../../src/features/auth/service/auth.service";

describe('refresh Token integration test', () => {

    const jwtService = container.resolve(JwtService)
    const authService = container.resolve(AuthService)

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

        //todo почему ниже не работает деструктуризация

        // const {deviceId, userId} = jwtService.verifyAndDecodeToken(tokens!.refreshToken)
        const tokenPayload = jwtService.verifyAndDecodeToken(tokens!.refreshToken)

        await new Promise(resolve => setTimeout(resolve, 1000))
        let newTokens = await authService.refreshToken(tokenPayload!.deviceId, tokenPayload!.userId, tokenPayload!.iat)


        expect(newTokens!.data).not.toBe(tokens)
        expect(newTokens!.status).toBe(ResultStatus.Success)

    });

})