import { db } from '../../src/db/db'
import { SETTINGS } from '../../src/common/config/settings'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { agent } from 'supertest'
import { app } from '../../src/app'
import { bcryptService } from '../../src/common/adapters/bcrypt.service'

describe('user tests', () => {
	beforeAll(async () => {
		const mongod = await MongoMemoryServer.create()
		const uri = mongod.getUri()
		await db.run(uri)
	})

	it(`shouldn't auth user `, async () => {
		const data = {
			_id: String(new ObjectId()),
			login: 'WwldYc21wu',
			password: await bcryptService.createPasswordHash('string'),
			email: 'asw@mail.ru',
			createdAt: new Date().toISOString()
		}
		await db.getCollection().usersCollection.insertOne(data)

		const buff = Buffer.from(SETTINGS.ADMIN_AUTH || '', 'utf-8')
		const decodedAuth = buff.toString('base64')
		const authData = {
			loginOrEmail: 'WwldYc21wu',
			password: 'string_no_valid'
		}
		const result = await agent(app)
			.post(SETTINGS.PATH.AUTH + '/login')
			.send(authData)
			.set({ authorization: `Basic ${decodedAuth}` })

		expect(result.status).toBe(StatusCodes.UNAUTHORIZED)
	})

	it(`should auth user `, async () => {
		const data = {
			_id: String(new ObjectId()),
			login: 'WwldYc21wu',
			password: await bcryptService.createPasswordHash('string'),
			email: 'asw@mail.ru',
			createdAt: new Date().toISOString()
		}
		await db.getCollection().usersCollection.insertOne(data)

		const buff = Buffer.from(SETTINGS.ADMIN_AUTH || '', 'utf-8')
		const decodedAuth = buff.toString('base64')
		const authData = {
			loginOrEmail: 'WwldYc21wu',
			password: 'string'
		}
		const result = await agent(app)
			.post(SETTINGS.PATH.AUTH + '/login')
			.send(authData)
			.set({ authorization: `Basic ${decodedAuth}` })

		expect(result.status).toBe(StatusCodes.NO_CONTENT)
	})

	afterAll(done => {
		done()
	})
})
