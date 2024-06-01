import {authManagerTest} from "../auth/authManager.test";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/db";
import {StatusCodes} from "http-status-codes";
import {agent} from "supertest";
import {app} from "../../../src/app";
import {SETTINGS} from "../../../src/common/config/settings";
import {jwtService} from "../../../src/common/adapters/jwt.service";
import {userManagerTest} from "../users/userManager.test";
import {PATH} from "../../../src/common/config/path";
import {DeviceModel} from "../../../src/features/securityDevices/domain/devices.entity";

describe('e2e test for devices', () => {
    let tokensUser1: { refreshToken: string, accessToken: string } | undefined
    let tokensUser2: { refreshToken: string, accessToken: string } | undefined
    let tokensUser3: { refreshToken: string, accessToken: string } | undefined
    let tokensUser4: { refreshToken: string, accessToken: string } | undefined
    let user1
    let user2
    let tokensAnotherUser1: { refreshToken: string, accessToken: string } | undefined


    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })
    beforeEach(async () => {
        await db.drop()

        // todo написать функцию для авторизации пользователей
        // Создаем пользователя, логиним пользователя 4 раза с разныными user-agent;
        user1 = await userManagerTest.createUser('default', SETTINGS.ADMIN_AUTH)
        tokensUser1 = await authManagerTest.createAndAuthUser(
            'default',
            'default',
            StatusCodes.OK,
            '1.1.1.1'
        )
        tokensUser2 = await authManagerTest.authUser(
            'default',
            StatusCodes.OK,
            '2.2.2.2'
        )
        tokensUser3 = await authManagerTest.authUser(
            'default',
            StatusCodes.OK,
            '3.3.3.3'
        )
        tokensUser4 = await authManagerTest.authUser(
            'default',
            StatusCodes.OK,
            '4.4.4.4'
        )
        const newInputData = {
            loginOrEmail: 'alexx1234',
            password: '123456'
        }
        const newUserData = {
            login: 'alexx1234',
            password: '123456',
            email: 'asdasdas@ea.com'
        }

        user2 = await userManagerTest.createUser(
            newUserData, SETTINGS.ADMIN_AUTH
        )
        tokensAnotherUser1 = await authManagerTest.authUser(newInputData)

    })

    afterAll(async () => {
        await db.stop()
    })

    afterAll(done => {
        done()
    })

    it('Should get a device list of devices', async () => {

        // проверяем всё ли создалось
        const refreshToken = tokensUser4!.refreshToken
        const result = await agent(app)
            .get(`${PATH.SECURITY}/devices`)
            .set('Cookie', [`refreshToken=${refreshToken}`])

        debugger
        expect(result.body.length).toBe(4)
    })

    it('Should delete another devices', async () => {

        // удаляем девайсы
        const refreshToken = tokensUser4!.refreshToken
        const result = await agent(app)
            .delete(`${PATH.SECURITY}/devices`)
            .set('Cookie', [`refreshToken=${refreshToken}`])

        //проверяем статус
        expect(result.status).toBe(StatusCodes.NO_CONTENT)

        //смотрим что в базе остался один
        const userID = jwtService.getUserIdByToken(refreshToken)
        const devices = await DeviceModel.find({userId: userID!}).lean()
        expect(devices.length).toBe(1)
    })

    it(`Shouldn't delete device with token from another user`, async () => {

        // удаляем девайсы
        const refreshToken = tokensAnotherUser1!.refreshToken

        const device = jwtService.verifyAndDecodeToken(tokensUser1!.refreshToken)

        const result = await agent(app)
            .delete(`${PATH.SECURITY}/devices/${device!.deviceId}`)
            .set('Cookie', [`refreshToken=${refreshToken}`])

        //проверяем статус
        expect(result.status).toBe(StatusCodes.FORBIDDEN)

        //смотрим что в базе остался один
        // const userID = jwtService.getUserIdByToken(refreshToken)
        // const devices = await db.getCollection().devices.find({userId: userID!}).toArray()
        // expect(devices.length).toBe(4)
    })

    it(`Should delete device`, async () => {

        // удаляем девайсы
        const refreshToken = tokensUser1!.refreshToken

        const device = jwtService.verifyAndDecodeToken(tokensUser1!.refreshToken)

        const result = await agent(app)
            .delete(`${PATH.SECURITY}/devices/${device!.deviceId}`)
            .set('Cookie', [`refreshToken=${refreshToken}`])

        //проверяем статус
        expect(result.status).toBe(StatusCodes.NO_CONTENT)

        //смотрим что в базе остался один
        // const userID = jwtService.getUserIdByToken(refreshToken)
        // const devices = await db.getCollection().devices.find({userId: userID!}).toArray()
        // expect(devices.length).toBe(4)
    })


});