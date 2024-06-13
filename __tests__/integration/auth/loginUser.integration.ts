import {MongoMemoryServer} from 'mongodb-memory-server'
import {db} from '../../../src/db/db'
import {jest} from "@jest/globals";
import {userManagerTest} from "../../e2e/users/userManager.test";
import {authManagerTest} from "../../e2e/auth/authManager.test";
import {SETTINGS} from "../../../src/common/config/settings";
import {container} from "../../../src/ioc";
import {JwtService} from "../../../src/common/adapters/jwtService";
import {UsersRepository} from "../../../src/features/users/repository/users.repository";
import {DevicesRepository} from "../../../src/features/securityDevices/repository/devices.repository";
import {AuthService} from "../../../src/features/auth/service/auth.service";
import {BcryptService} from "../../../src/common/adapters/bcrypt.service";

describe('Login User', () => {

    const jwtService = container.resolve(JwtService);
    const usersRepository = container.resolve(UsersRepository)
    const devicesRepository = container.resolve(DevicesRepository)
    const authService = container.resolve(AuthService)
    const bcryptService = container.resolve(BcryptService)

    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    beforeEach(async () => {
        await db.drop()
    })

    afterEach(async () => {
        jest.useRealTimers()
        jest.restoreAllMocks();
    })

    afterAll(async () => {
        await db.stop()
    })

    afterAll(done => {
        done()
    })

    it('should login user', async () => {
        usersRepository.findUserWithPass = jest.fn<typeof usersRepository.findUserWithPass>().mockImplementation(async () => {
            return {
                _id: 'id',
                login: 'login',
                email: 'email',
                createdAt: new Date().toISOString(),
                password: '123',
                confirmationCode: '12345',
                confirmationCodeExpired: new Date(),
                isConfirmed: true
            }
        })

        bcryptService.comparePasswordsHash = jest.fn<typeof bcryptService.comparePasswordsHash>()
            .mockImplementation(async (reqPassPlainText: string, dbPassHash: string) => {
                return true
            })

        const result = await authService.loginUser({loginOrEmail: 'login', password: '123'}, 'Chrome', '0.0.0.1')

        expect(usersRepository.findUserWithPass).toHaveBeenCalled()

        expect(usersRepository.findUserWithPass).toHaveBeenCalledTimes(1)

        expect(result.data).toEqual({
            accessToken: expect.stringMatching(/^([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)$/),
            refreshToken: expect.stringMatching(/^([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)$/)
        })

    })

    it('should update refresh token', async () => {

        const user = {
            login: 'login',
            email: 'email@mail.ru',
            password: '123456'
        }

        await userManagerTest.createUser(user, SETTINGS.ADMIN_AUTH)

        const loginInputData = {
            loginOrEmail: user.login,
            password: user.password
        }

        const tokens = await authManagerTest.authUser(loginInputData)

        await new Promise(resolve => setTimeout(resolve, 1000))

        const tokenPayload = jwtService.verifyAndDecodeToken(tokens!.refreshToken)
        const result = await authService.refreshToken(tokenPayload!.deviceId, tokenPayload!.userId, tokenPayload!.iat)

        expect(tokens!.refreshToken).not.toBe(result.data!.refreshToken)

    })

    it(`shouldn't update refresh token after expired time`, async () => {
        jest.replaceProperty(SETTINGS, 'EXPIRATION', {REFRESH_TOKEN: '1s', ACCESS_TOKEN: '1s'});

        const user = {
            login: 'login',
            email: 'email@mail.ru',
            password: '123456'
        }

        await userManagerTest.createUser(user, SETTINGS.ADMIN_AUTH)

        const loginInputData = {
            loginOrEmail: user.login,
            password: user.password
        }

        const tokens = await authManagerTest.authUser(loginInputData)

        await new Promise(resolve => setTimeout(resolve, 2000))

        const tokenPayload = jwtService.verifyAndDecodeToken(tokens!.refreshToken)

        expect(tokenPayload).toBeNull()

    })
})