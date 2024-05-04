import { MongoMemoryServer } from 'mongodb-memory-server'
import { db } from '../../../src/db/db'
import { agent } from 'supertest'
import { app } from '../../../src/app'
import { userManagerTest } from '../users/userManager.test'
import { SETTINGS } from '../../../src/common/config/settings'
import { StatusCodes } from 'http-status-codes'

describe('auth test', () => {
	beforeAll(async () => {
		const mongod = await MongoMemoryServer.create()
		const uri = mongod.getUri()
		await db.run(uri)
	})

	it(`should write All is running `, async () => {
		await agent(app)
			.get('/')
			.expect('All is running!')
	})

	//TODO: написать тесты (negative)
	it('should auth', async () => {
		const newUser =
			{
				'login': 'alexx123',
				'password': '123456',
				'email': 'waterplaza@e.com'
			}
		await userManagerTest.createUser(newUser, SETTINGS.ADMIN_AUTH)

		const data = {
			'loginOrEmail': 'alexx123',
			'password': '123456'
		}

		const res = await agent(app)
			.post(`${SETTINGS.PATH.AUTH}/login`)
			.send(data)
			.expect(StatusCodes.OK)

		expect(res.body).toEqual(
			{
				'accessToken': res.body.accessToken
			}
		)

		const getUserByToken = await agent(app)
			.get(`${SETTINGS.PATH.AUTH}/me`)
			.set('Authorization', `Bearer ${res.body.accessToken}`)

		expect(getUserByToken.body).toEqual({
			'email': 'waterplaza@e.com',
			'login': 'alexx123',
			'userId': expect.any(String)
		})

	})

	afterAll(async () => {
		db.stop()
	})

	afterAll(done => {
		done()
	})
})