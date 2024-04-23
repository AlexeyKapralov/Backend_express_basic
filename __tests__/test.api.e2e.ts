import { agent } from 'supertest'
import { app } from '../src'

describe('test', () => {
	it('test', () => {
		agent(app).get('/').expect('Hello World!')
	})
})
