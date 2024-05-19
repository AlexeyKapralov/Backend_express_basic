import {MongoMemoryServer} from 'mongodb-memory-server'
import {db} from '../../../src/db/db'
import {loginService} from '../../../src/service/login.service'
import {usersQueryRepository} from "../../../src/repositories/users/usersQuery.repository";
import {jest} from "@jest/globals";
import {bcryptService} from "../../../src/common/adapters/bcrypt.service";
import {userManagerTest} from "../../e2e/users/userManager.test";
import {authManagerTest} from "../../e2e/auth/authManager.test";
import {ObjectId} from "mongodb";
import {SETTINGS} from "../../../src/common/config/settings";
import {ResultStatus} from "../../../src/common/types/resultStatus.type";

describe('Authentication User', () => {
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

    it('should login user', async () => {
        usersQueryRepository.findUserWithPass = jest.fn<typeof usersQueryRepository.findUserWithPass>().mockImplementation(async () => {
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

        bcryptService.comparePasswordsHash = jest.fn<typeof bcryptService.comparePasswordsHash>().mockImplementation(async (reqPassPlainText: string, dbPassHash: string) => {
            return true
        })

        const result = await loginService.loginUser({loginOrEmail: 'login', password: '123'})

        expect(usersQueryRepository.findUserWithPass).toHaveBeenCalled()

        expect(usersQueryRepository.findUserWithPass).toHaveBeenCalledTimes(1)


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
        const result = await loginService.refreshToken(tokens!.refreshToken)

        const isBlocked = await db.getCollection().blockListCollection.findOne({refreshToken: tokens!.refreshToken})

        expect(tokens!.refreshToken).not.toBe(result.data!.refreshToken)
        expect(isBlocked).toEqual({_id: expect.any(ObjectId), refreshToken: tokens!.refreshToken})

    })

    it(`shouldn't update refresh token after expired time`, async () => {

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

        jest.useFakeTimers()

        let result
        setTimeout(async () => {
            result = await loginService.refreshToken(tokens!.refreshToken)
        }, 25000)

        jest.advanceTimersByTime(25000)
        jest.useRealTimers()


        const isBlocked = await db.getCollection().blockListCollection.findOne({refreshToken: tokens!.refreshToken})

        expect(result!.status).toBe(ResultStatus.Unauthorized)
        expect(isBlocked).toEqual({_id: expect.any(ObjectId), refreshToken: tokens!.refreshToken})

    })
})