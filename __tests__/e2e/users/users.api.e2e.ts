import {agent} from 'supertest'
import {app} from '../../../src/app'
import {db} from '../../../src/db/db'
import {SETTINGS} from '../../../src/common/config/settings'
import {MongoMemoryServer} from 'mongodb-memory-server'
import {userManagerTest} from './userManager.test'
import {StatusCodes} from 'http-status-codes'
import {getUserViewModel} from "../../../src/features/users/mappers/userMappers";
import {PATH} from "../../../src/common/config/path";


describe('user tests', () => {
    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    //check pagination
    it('should get users with default pagination', async () => {
        await db.drop()
        await userManagerTest.createUsers(20)

        const res = await agent(app)
            .get(PATH.USERS)

        expect(res.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 10,
            totalCount: 20,
            items: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    login: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                })
            ])
        })

        const users = await db.getCollection().usersCollection
            .find()
            .sort('createdAt', 'desc')
            .skip((1 - 1) * 10)
            .limit(10)
            .toArray()

        expect(users.map(getUserViewModel)).toEqual(res.body.items)


    })
    it('should get with input custom pagination', async () => {
        await db.drop()
        await userManagerTest.createUsers(20)

        const res = await agent(app)
            .get(PATH.USERS)
            .query({
                sortBy: 'login',
                sortDirection: 'asc',
                pageNumber: 2,
                pageSize: 5,
                searchLoginTerm: 'John',
                searchEmailTerm: '1'
            })


        const users = await db.getCollection().usersCollection
            .find({
                $or: [
                    {login: {$regex: 'John', $options: 'i'}},
                    {email: {$regex: '1', $options: 'i'}}
                ]
            })
            .sort('login', 'asc')
            .skip((2 - 1) * 5)
            .limit(5)
            .toArray()
        const countUsers = await db.getCollection().usersCollection
            .find({
                $or: [
                    {login: {$regex: 'John', $options: 'i'}},
                    {email: {$regex: '1', $options: 'i'}}
                ]
            })
            .toArray()

        expect(res.body).toEqual({
            pagesCount: Math.ceil(countUsers.length / 5),
            page: 2,
            pageSize: 5,
            totalCount: countUsers.length,
            items: expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    login: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
                })
            ])
        })

        expect(users.map(getUserViewModel)).toEqual(res.body.items)
    })

    //test create
    it(`shouldn't create user with auth and incorrect input data`, async () => {
        const data = {
            login: 'd',
            password: 'a',
            email: 'waterasdasd@e'
        }
        await userManagerTest.createUser(
            data,
            SETTINGS.ADMIN_AUTH,
            StatusCodes.BAD_REQUEST
        )
    })
    it(`shouldn't create user with auth and correct input data`, async () => {
        const data = {
            login: 'WwldYc21wu',
            password: 'string',
            email:
                'gHVEtCudxVZoK6ETpak74_r4X6TF-Yjyr-16FPZBouaMivMioRm21fgOP9RsaUHKqiit@oOxUwm6fKkBjstdw-wSawULg8PmBk9lAV06XQr9RE6aw_S9n5Is9qnLZweVHOwijtrgHhXuz7YjZ9PTChhkfYly4gq1Q1g2nz4o.dFIw'
        }
        await userManagerTest.createUser(
            data,
            'no_valid_credentials',
            StatusCodes.UNAUTHORIZED
        )
    })
    it('should create user with auth and correct input data', async () => {
        const data = {
            login: 'WwldYc21wu',
            password: 'string',
            email: 'asw@mail.ru'
        }
        await userManagerTest.createUser(data, SETTINGS.ADMIN_AUTH)
    })

    //test delete
    it(`shouldn't delete user with unknown id`, async () => {
        await userManagerTest.deleteUser('aaaaa', SETTINGS.ADMIN_AUTH, StatusCodes.NOT_FOUND)
    })
    it(`should delete user with correct id`, async () => {
        const user = await db.getCollection().usersCollection.findOne()
        await userManagerTest.deleteUser(user!._id, SETTINGS.ADMIN_AUTH)
    })

    afterAll(async () => {
        await db.stop()
    })

    afterAll(done => {
        done()
    })


})
