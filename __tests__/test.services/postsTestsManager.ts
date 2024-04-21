import { StatusCodes } from 'http-status-codes'
import { postInputModelType } from '../../src/features/posts/models/postInputModelType'
import { SETTINGS } from '../../src/settings'
import { agent as request } from 'supertest'
import { app } from '../../src/app'

export const postsTestsManager = {
	async createPost(
		body: postInputModelType,
		auth: string,
		expected_status = StatusCodes.CREATED
	) {
		const buff = Buffer.from(auth, 'utf8')
		const decodedAuth = buff.toString('base64')
		return await request(app)
			.post(SETTINGS.PATH.POSTS)
			.set('authorization', 'Basic ' + decodedAuth)
			.send(body)
			.expect(expected_status)
	}
}
