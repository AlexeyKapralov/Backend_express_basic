import {JwtService} from "../../../src/common/adapters/jwtService";
import {userManagerTest} from "../../e2e/users/userManager.test";
import {SETTINGS} from "../../../src/common/config/settings";
import {authManagerTest} from "../../e2e/auth/authManager.test";
import {ResultStatus} from "../../../src/common/types/resultStatus.type";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/db";
import {jest} from "@jest/globals";
import {container} from "../../../src/ioc";
import {DevicesService} from "../../../src/features/securityDevices/service/devicesService";

describe('integration test delete device', () => {
    const jwtService = container.resolve(JwtService)
    const devicesService = container.resolve(DevicesService)

    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    let device
    let tokens
    let tokens2
    beforeEach(async () => {
        await db.drop()
        const userData = {
            login: 'login',
            password: 'qwert1234',
            email: 'asdf@mail.ru'
        }
        await userManagerTest.createUser(userData, SETTINGS.ADMIN_AUTH)
        tokens = await authManagerTest.authUser({
            loginOrEmail: userData.email,
            password: userData.password
        })
        device = jwtService.verifyAndDecodeToken(tokens!.refreshToken)

        const userData2 = {
            login: 'login2',
            password: 'qwert1234',
            email: 'asdf2@mail.ru'
        }
        await userManagerTest.createUser(userData2, SETTINGS.ADMIN_AUTH)
        tokens2 = await authManagerTest.authUser({
            loginOrEmail: userData2.email,
            password: userData2.password
        })
    })

    afterEach(async () => {
        jest.useRealTimers()
    })

    afterAll(async () => {
        await db.stop()
    })

    afterAll(done => {
        done()
    })

    it('should return success with correct token + deviceID', async () => {
        const userId = jwtService.getUserIdByToken(tokens!.refreshToken)
        const res = await devicesService.deleteDevice(device!.deviceId, userId!)
        expect(res.status === ResultStatus.Success)
    });
    it('should return unauthorized with incorrect token', async () => {
        const res = await devicesService.deleteDevice(device!.deviceId, '123')
        expect(res.status === ResultStatus.Unauthorized)
    });
    it('should return unauthorized with incorrect deviceId', async () => {
        const userId = jwtService.getUserIdByToken(tokens!.refreshToken)
        const res = await devicesService.deleteDevice('123', userId!)
        expect(res.status === ResultStatus.Unauthorized)
    });
    it('should return forbidden with another deviceID', async () => {
        const userId = jwtService.getUserIdByToken(tokens!.refreshToken)
        const res = await devicesService.deleteDevice(device!.deviceId, userId!)
        expect(res.status === ResultStatus.Forbidden)
    });
})