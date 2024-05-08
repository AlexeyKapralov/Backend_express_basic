import { MongoMemoryServer } from 'mongodb-memory-server'
import { db } from '../../../src/db/db'
import { agent } from 'supertest'
import { app } from '../../../src/app'
import { StatusCodes } from 'http-status-codes'
import { authManagerTest } from './authManager.test'
import { ILoginInputModel } from '../../../src/features/auth/models/loginInput.model'

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

	it(`should auth`, async () => {
		await authManagerTest.createAndAuthUser()
	})

	it(`shouldn't auth`, async () => {

		const newBadLoginData: ILoginInputModel = {
			loginOrEmail: 'avc',
			password: 'axzcxzc'
		}
			await authManagerTest.createAndAuthUser(newBadLoginData, 'default', StatusCodes.UNAUTHORIZED)
	})


	afterAll(async () => {
		db.stop()
	})

	afterAll(done => {
		done()
	})
})