import { agent } from 'supertest'
import { app } from '../../src/app'
import { db } from '../../src/db/db'
import { agent as request } from 'supertest'
import { SETTINGS } from '../../src/common/config/settings'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { userTestManager } from './user.test.manager'
import { StatusCodes } from 'http-status-codes'

describe('user tests', () => {
	beforeAll(async () => {
		const mongod = await MongoMemoryServer.create()
		const uri = mongod.getUri()
		await db.run(uri)
	})

	it(`shouldn't create user with auth and incorrect input data`, async () => {
		const data = {
			login: 'd',
			password: 'a',
			email: 'waterasdasd@e'
		}
		await userTestManager.createUser(
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
		await userTestManager.createUser(
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
		await userTestManager.createUser(data, SETTINGS.ADMIN_AUTH)
	})

	afterAll(async () => {
		db.stop()
	})

	afterAll(done => {
		done()
	})
})
