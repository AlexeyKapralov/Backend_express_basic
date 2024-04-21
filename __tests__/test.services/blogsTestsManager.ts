import { StatusCodes } from 'http-status-codes'
import { blogInputModelType } from '../../src/features/blogs/models/blogInputModelType'
import { SETTINGS } from '../../src/settings'
import { agent as request } from 'supertest'
import { app } from '../../src/app'
import {
	BlogPostInputModelType,
	postInputModelType
} from '../../src/features/posts/models/postInputModelType'
import { blogsCollection, PostType } from '../../src/db/db'
import { ObjectId } from 'mongodb'
import { postRepository } from '../../src/repositories/posts.repository'

export const blogsTestsManager = {
	async getBlogById(blogId: string, status: number) {
		const res = await request(app)
			.get(SETTINGS.PATH.BLOGS + '/' + blogId)
			.expect(status)
		return res
	},
	async createBlog(
		body: blogInputModelType,
		auth: string,
		httpStatusType = StatusCodes.CREATED
	) {
		const buff = Buffer.from(auth, 'utf-8')
		const decodedAuth = buff.toString('base64')

		// запрос на создание нового блога
		const res = await request(app)
			.post(SETTINGS.PATH.BLOGS)
			.set({ authorization: `Basic ${decodedAuth}` })
			.send(body)
			.expect(httpStatusType)

		if (httpStatusType === StatusCodes.CREATED) {
			// проверка созданного блога
			expect(res.body).toEqual({
				id: expect.any(String),
				name: expect.any(String),
				description: expect.any(String),
				websiteUrl: expect.any(String),
				createdAt: expect.any(String),
				isMembership: expect.any(Boolean)
			})
			expect(res.body.createdAt).toMatch(
				/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/
			)
		}
		return res
	},
	async updateBlog(
		id: string,
		body: blogInputModelType,
		auth: string,
		httpStatusType = StatusCodes.CREATED
	) {
		const buff = Buffer.from(auth, 'utf-8')
		const decodedAuth = buff.toString('base64')

		// запрос на создание нового блога
		const res = await request(app)
			.put(SETTINGS.PATH.BLOGS + '/' + id)
			.set({ authorization: `Basic ${decodedAuth}` })
			.send(body)
			.expect(httpStatusType)

		return res
	},
	async deleteBlog(
		id: string,
		auth: string,
		httpStatusType = StatusCodes.NO_CONTENT
	) {
		const buff = Buffer.from(auth, 'utf-8')
		const decodedAuth = buff.toString('base64')

		const res = await request(app)
			.delete(SETTINGS.PATH.BLOGS + '/' + id)
			.set({ authorization: `Basic ${decodedAuth}` })
			.expect(httpStatusType)

		return res
	},
	async createPostForBlog(
		id: string,
		body: BlogPostInputModelType,
		auth: string,
		expected_status_code = StatusCodes.CREATED
	) {
		const blog = await blogsCollection.findOne({
			_id: id
		})

		if (blog !== null) {
			const buff = Buffer.from(auth, 'utf-8')
			const decodedAuth = buff.toString('base64')

			const res = await request(app)
				.post(SETTINGS.PATH.BLOGS + '/' + id + '/posts')
				.set({ authorization: `Basic ${decodedAuth}` })
				.send(body)
				.expect(expected_status_code)

			return { blog, res }
		}
	},
	async getPostsByBlogId(id: string) {
		const posts = await postRepository.getPostsByBlogId(id)
	}
}
