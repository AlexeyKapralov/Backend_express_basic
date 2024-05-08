import { IBlogInputModel } from '../../../src/features/blogs/models/blogInput.model'
import { agent } from 'supertest'
import { app } from '../../../src/app'
import { SETTINGS } from '../../../src/common/config/settings'
import { StatusCodes } from 'http-status-codes'

export const blogsManagerTest = {
	async createBlog(data: IBlogInputModel | 'default' = 'default', accessToken: string) {
		if (data === 'default') {
			data = {
				'name': 'string',
				'description': 'string',
				'websiteUrl': 'https://8aD.ru'
			}
		}

		const res = await agent(app)
			.post(SETTINGS.PATH.BLOGS)
			.send(data)
			.set({ authorization: `Bearer ${accessToken}` })
			.expect(StatusCodes.CREATED)

		expect(res.body).toEqual({
			id: expect.any(String),
			name: data.name,
			description: data.description,
			websiteUrl: data.websiteUrl,
			createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
			isMembership: false
		})

		return res.body
	}
}