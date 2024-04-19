import { agent as request } from 'supertest'
import { app } from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { SETTINGS } from '../src/settings'
import { blogsCollection } from '../src/db/db'
import { blogReturn, blogs } from '../src/db/mock'

describe('app', () => {
	beforeAll(async () => {
		await request(app).delete(SETTINGS.PATH.TEST_DELETE)
	})

	it('should return "All is running"', () => {
		request(app).get('/').expect(StatusCodes.OK).expect('All is running')
	})

	it('should return empty array with default pagination fields', async () => {
		const res = await request(app)
			.get(SETTINGS.PATH.BLOGS)
			.expect(StatusCodes.OK)

		expect(res.body).toEqual({
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: []
		})
	})

	it('should add array and get blogs with default pagination fields', async () => {
		const createdBlogs = await blogsCollection.insertMany(blogs)

		if (createdBlogs) {
			const res = await request(app)
				.get(SETTINGS.PATH.BLOGS)
				.expect(StatusCodes.OK)

			expect(res.body).toEqual({
				pagesCount: 2,
				page: 1,
				pageSize: 10,
				totalCount: 20,
				items: expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(String),
						name: expect.any(String),
						description: expect.any(String),
						websiteUrl: expect.any(String),
						createdAt: expect.any(String),
						isMembership: expect.any(Boolean)
					})
				])
			})
		}
	})
	it('should create blog', async () => {
		const newBlog = {
			name: 'a',
			description: 'string',
			websiteUrl: 'https://As3fwcNYmnby.ru'
		}

		const res = await request(app)
			.post(SETTINGS.PATH.BLOGS)
			.send(newBlog)
			.set('Authorization', `Basic ${SETTINGS.ADMIN_AUTH}`)
			.expect(StatusCodes.CREATED)
	})
})
