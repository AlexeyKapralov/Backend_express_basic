import { MongoMemoryServer } from 'mongodb-memory-server'
import { db } from '../../../src/db/db'

describe('auth test', () => {
	beforeAll(async () => {
		const mongod = await MongoMemoryServer.create()
		const uri = mongod.getUri()
		await db.run(uri)
	})
	beforeEach(async ()=> {
		await db.drop()
	})

	afterAll(async () => {
		db.stop()
	})

	afterAll(done => {
		done()
	})



})