import { agent as request } from 'supertest'
import { app } from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { SETTINGS } from '../src/settings'
import { blogsCollection, BlogType } from '../src/db/db'
import { blogs } from '../src/db/mock'
import { blogsTestsManager } from './test.services/blogsTestsManager'
import {
	paginatorPostsViewModelType,
	postViewModelType
} from '../src/features/posts/models/postViewModelType'

describe('app', () => {
	beforeAll(async () => {
		await request(app).delete(SETTINGS.PATH.TEST_DELETE)
	})

	it('should return "All is running"', () => {
		request(app).get('/').expect(StatusCodes.OK).expect('All is running')
	})

	it('should not found', async () => {
		await request(app).get(SETTINGS.PATH.BLOGS).expect(StatusCodes.NOT_FOUND)
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

	it('should return array with custom pagination fields', async () => {
		const res = await request(app)
			.get(SETTINGS.PATH.BLOGS)
			.query({
				pageNumber: 2
			})
			.expect(StatusCodes.OK)

		expect(res.body).toEqual({
			pagesCount: 2,
			page: 2,
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
	})

	let blogGlobal: BlogType
	it('should create blog with correct data', async () => {
		const body = {
			name: 'a',
			description: 'string',
			websiteUrl: 'https://As3fwcNYmnby.ru'
		}

		await blogsTestsManager.createBlog(
			body,
			SETTINGS.ADMIN_AUTH,
			StatusCodes.CREATED
		)

		// получение созданного блога в бд
		blogGlobal = (await blogsCollection.findOne({
			name: body.name
		})) as BlogType

		// проверка созданного блога в бд
		expect(blogGlobal).toEqual({
			_id: expect.any(String),
			name: expect.any(String),
			description: expect.any(String),
			websiteUrl: expect.any(String),
			createdAt: expect.any(String),
			isMembership: expect.any(Boolean)
		})
		expect(blogGlobal!.createdAt).toMatch(
			/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/
		)
	})

	it("shouldn't create blog with incorrect data", async () => {
		const body = {
			name: 'aaaaaaaaaaaaaaaaaaaaa',
			description:
				'stringstr ingstringstringstr \n \
                ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 stringstr ingstringstringstr \n \
                ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 tringstringstringstringstringstringstringstringstringstringstringstring',
			websiteUrl: 'ttps://As3fwcNYmnby.ru'
		}

		const res = await blogsTestsManager.createBlog(
			body,
			SETTINGS.ADMIN_AUTH,
			StatusCodes.BAD_REQUEST
		)

		expect(res.status).toEqual(StatusCodes.BAD_REQUEST)

		// проверка вернувшщейся ошибки
		return expect(res.body).toEqual({
			errorsMessages: [
				{
					message: expect.any(String),
					field: 'name'
				},
				{
					message: expect.any(String),
					field: 'description'
				},
				{
					message: expect.any(String),
					field: 'websiteUrl'
				}
			]
		})
	})

	it('should create blog with no auth', async () => {
		const body = {
			name: 'a',
			description: 'string',
			websiteUrl: 'https://As3fwcNYmnby.ru'
		}

		await blogsTestsManager.createBlog(body, ' ', StatusCodes.UNAUTHORIZED)
	})
	it('should get blogBy Id', async () => {
		await blogsTestsManager.getBlogById(blogGlobal._id, StatusCodes.OK)
	})
	it("shouldn't get blogBy Id", async () => {
		await blogsTestsManager.getBlogById('aaa', StatusCodes.NOT_FOUND)
	})

	it("shouldn't update without auth", async () => {
		const body = {
			name: 'twentiethStr2',
			websiteUrl: 'https://twentiethString.com',
			description: 'twentiethString22222'
		}
		const auth = 'aaa'

		await blogsTestsManager.updateBlog(
			blogGlobal._id,
			body,
			auth,
			StatusCodes.UNAUTHORIZED
		)
	})

	it("shouldn't update without incorrect body", async () => {
		const body = {
			name: 'twentiethStr2twentiethStr2',
			websiteUrl: 'ttps://twentiethString.com',
			description:
				'stringstr ingstringstringstr \n \
                ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 stringstr ingstringstringstr \n \
                ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 ingstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstri \n \
                 ngstringstringstringstringstringstringstringstri\n \
                 ngstringstringstringstringstringstringstringstringstr\n \
                 ingstringstringstringstringstringstringstringstringstrings\n \
                 tringstringstringstringstringstringstringstringstringstringstringstring'
		}
		const auth = SETTINGS.ADMIN_AUTH

		const res = await blogsTestsManager.updateBlog(
			blogGlobal._id,
			body,
			auth,
			StatusCodes.BAD_REQUEST
		)

		// проверка вернувшщейся ошибки
		return expect(res.body).toEqual({
			errorsMessages: [
				{
					message: expect.any(String),
					field: 'name'
				},
				{
					message: expect.any(String),
					field: 'description'
				},
				{
					message: expect.any(String),
					field: 'websiteUrl'
				}
			]
		})
	})

	it('should update with correct body', async () => {
		const body = {
			name: 'twentiethStr2',
			websiteUrl: 'https://twentiethString.com',
			description: 'twentiethString22222'
		}
		const auth = SETTINGS.ADMIN_AUTH
		await blogsTestsManager.updateBlog(
			blogGlobal._id,
			body,
			auth,
			StatusCodes.NO_CONTENT
		)
	})

	it(`shouldn't create post blog by ID with unknown id`, async () => {
		const id = '-9'
		const body = {
			title: 'string',
			shortDescription: 'string',
			content: 'string'
		}

		const auth = SETTINGS.ADMIN_AUTH
		await blogsTestsManager.createPostForBlog(
			id,
			body,
			auth,
			StatusCodes.NOT_FOUND
		)
	})

	it(`shouldn't create post blog by ID with incorrect body`, async () => {
		const id = blogGlobal._id
		const body = {
			title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			shortDescription: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
			content: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
		}

		const auth = SETTINGS.ADMIN_AUTH
		const res = await blogsTestsManager.createPostForBlog(
			id,
			body,
			auth,
			StatusCodes.BAD_REQUEST
		)

		if (res) {
			expect(res.res.body).toEqual({
				errorsMessages: [
					{
						message: expect.any(String),
						field: 'title'
					},
					{
						message: expect.any(String),
						field: 'shortDescription'
					},
					{
						message: expect.any(String),
						field: 'content'
					}
				]
			})
		}
	})

	let postGlobal: postViewModelType
	it('should create post blog by ID', async () => {
		const id = blogGlobal._id
		const body = {
			title: 'string',
			shortDescription: 'string',
			content: 'string'
		}

		const auth = SETTINGS.ADMIN_AUTH
		const result = await blogsTestsManager.createPostForBlog(id, body, auth)

		const res = result?.res
		const blog = result?.blog
		postGlobal = res!.body

		expect(res!.body).toEqual({
			id: expect.any(String),
			title: expect.any(String),
			shortDescription: expect.any(String),
			content: expect.any(String),
			blogId: blog!._id,
			blogName: blog!.name,
			createdAt: expect.any(String)
		})
		expect(res!.body.createdAt).toMatch(
			/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/
		)
	})

	it('should return array with posts with default pagination fields', async () => {
		const res = await request(app)
			.get(SETTINGS.PATH.BLOGS + '/' + blogGlobal._id + '/posts')
			.expect(StatusCodes.OK)

		expect(res.body).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 1,
			items: [postGlobal]
		})
	})

	it("shouldn't delete blog with incorrect id", async () => {
		const auth = SETTINGS.ADMIN_AUTH
		await blogsTestsManager.deleteBlog('1234', auth, StatusCodes.NOT_FOUND)
	})

	it("shouldn't delete blog with no auth", async () => {
		const auth = 'aaa'
		await blogsTestsManager.deleteBlog(
			blogGlobal._id,
			auth,
			StatusCodes.UNAUTHORIZED
		)
	})

	it('should delete blog', async () => {
		const auth = SETTINGS.ADMIN_AUTH
		await blogsTestsManager.deleteBlog(
			blogGlobal._id,
			auth,
			StatusCodes.NO_CONTENT
		)
	})
})
