import { agent } from 'supertest'
import { app } from '../src/app'

describe('user tests', () => {
	it('test', () => {
		agent(app).get('/').expect('All is running!')
	})

	afterAll(done => done())
})
