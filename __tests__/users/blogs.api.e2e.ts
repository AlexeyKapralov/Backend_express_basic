import {db} from '../../src/db/db'
import {MongoMemoryServer} from 'mongodb-memory-server'

describe('user tests', () => {
    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await db.run(uri)
    })

    afterAll(async () => {
        db.stop()
    })

    afterAll(done => {
        done()
    })


})
