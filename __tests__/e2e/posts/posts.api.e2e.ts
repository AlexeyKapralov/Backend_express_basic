import { MongoMemoryServer } from 'mongodb-memory-server'
import { db } from '../../../src/db/db'
import { agent } from 'supertest'
import { app } from '../../../src/app'
import { SETTINGS } from '../../../src/common/config/settings'
import { getPostViewModel } from '../../../src/common/utils/mappers'
import { postsManagerTest } from './postsManager'
import { IQueryModel } from '../../../src/common/types/query.model'
import { StatusCodes } from 'http-status-codes'
import { authManagerTest } from '../auth/authManager.test'
import { blogsManagerTest } from '../blogs/blogsManager.test'
import { IPostInputModel } from '../../../src/features/posts/models/postInput.model'
import { IBlogViewModel } from '../../../src/features/blogs/models/blogView.model'

describe('posts tests', () => {
	beforeAll(async () => {
		const mongod = await MongoMemoryServer.create()
		const uri = mongod.getUri()
		await db.run(uri)
	})
	beforeEach(async () => {
		await db.drop()
	})

	it(`should get posts with filter `, async () => {
		await agent(app)
			.get('/')
			.expect('All is running!')
	})

	it('should get posts with default pagination and empty array', async () => {
		await db.drop()

		const res = await agent(app)
			.get(SETTINGS.PATH.POSTS)

		expect(res.body).toEqual({
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: []
		})
	})

	it('should get posts with default pagination', async () => {
		await db.drop()
		await postsManagerTest.createPosts(20)

		const res = await agent(app)
			.get(SETTINGS.PATH.POSTS)

		expect(res.body).toEqual({
			pagesCount: 2,
			page: 1,
			pageSize: 10,
			totalCount: 20,
			items: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					title: expect.any(String),
					shortDescription: expect.any(String),
					content: expect.any(String),
					blogId: expect.any(String),
					blogName: expect.any(String),
					createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
				})
			])
		})

		const posts = await db.getCollection().postsCollection
			.find()
			.sort('createdAt', 'desc')
			.skip((1 - 1) * 10)
			.limit(10)
			.toArray()

		expect(posts.map(getPostViewModel)).toEqual(res.body.items)
	})

	it('should get posts with custom pagination', async () => {
		await db.drop()
		await postsManagerTest.createPosts(20)

		const query: IQueryModel = {
			pageNumber: 3,
			pageSize: 6,
			sortBy: 'title',
			sortDirection: 'asc'
		}
		const res = await agent(app)
			.get(SETTINGS.PATH.POSTS)
			.query(
				query
			)

		expect(res.body).toEqual({
			pagesCount: Math.ceil(20 / 6),
			page: 3,
			pageSize: 6,
			totalCount: 20,
			items: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					title: expect.any(String),
					shortDescription: expect.any(String),
					content: expect.any(String),
					blogId: expect.any(String),
					blogName: expect.any(String),
					createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
				})
			])
		})

		const posts = await db.getCollection().postsCollection
			.find()
			.sort('title', 'asc')
			.skip((3 - 1) * 6)
			.limit(6)
			.toArray()

		expect(posts.map(getPostViewModel)).toEqual(res.body.items)
	})

	it(`shouldn't create post with no auth`, async () => {
		await agent(app)
			.post(SETTINGS.PATH.POSTS)
			.expect(StatusCodes.UNAUTHORIZED)
	})

	it(`shouldn't create post with no request body`, async () => {
		const accessToken = await authManagerTest.createAndAuthUser()
		const res = await agent(app)
			.post(SETTINGS.PATH.POSTS)
			.set({ authorization: `Bearer ${accessToken}` })
			.expect(StatusCodes.BAD_REQUEST)

		expect(res.body).toEqual(
			{
				'errorsMessages': [
					{
						'message': 'Invalid value',
						'field': 'title'
					},
					{
						'message': 'Invalid value',
						'field': 'shortDescription'
					},
					{
						'message': 'Invalid value',
						'field': 'content'
					},
					{
						'message': 'blog not found',
						'field': 'blogId'
					}
				]
			}
		)
	})

	it(`should create post with correct request body and bearer token`, async () => {
		const accessToken = await authManagerTest.createAndAuthUser()
		const createdBlog: IBlogViewModel | undefined = await blogsManagerTest.createBlog('default', accessToken!)
		if (createdBlog) {
			const requestBody: IPostInputModel = {
				'title': 'string8',
				'shortDescription': 'string2',
				'content': 'string',
				'blogId': createdBlog!.id
			}

			await postsManagerTest.createPost(requestBody, accessToken!, StatusCodes.CREATED, createdBlog)
		}
	})

	it(`shouldn't get post by id with incorrect id`, async () => {
		const accessToken = await authManagerTest.createAndAuthUser()
		const createdBlog: IBlogViewModel | undefined = await blogsManagerTest.createBlog('default', accessToken!)
		if (createdBlog) {
			const requestBody = {
				'title': 'string8',
				'shortDescription': 'string2',
				'content': 'string',
				'blogId': createdBlog!.id
			}

			const post = await postsManagerTest.createPost(requestBody, accessToken!, StatusCodes.CREATED, createdBlog)
			if (post) {
				await postsManagerTest.getPostById('random text', StatusCodes.NOT_FOUND)
			}
		}
	})

	it(`should get post by id`, async () => {
		const accessToken = await authManagerTest.createAndAuthUser()
		const createdBlog: IBlogViewModel | undefined = await blogsManagerTest.createBlog('default', accessToken!)
		if (createdBlog) {
			const requestBody = {
				'title': 'string8',
				'shortDescription': 'string2',
				'content': 'string',
				'blogId': createdBlog!.id
			}

			const post = await postsManagerTest.createPost(requestBody, accessToken!, StatusCodes.CREATED, createdBlog)
			if (post) {
				await postsManagerTest.getPostById(post.id, StatusCodes.OK)
			}

		}
	})

	it(`should update post by id`, async () => {
		const accessToken = await authManagerTest.createAndAuthUser()
		const createdBlog: IBlogViewModel | undefined = await blogsManagerTest.createBlog('default', accessToken!)
		if (createdBlog) {
			const requestBody = {
				'title': 'a',
				'shortDescription': 'abc',
				'content': 'abcd',
				'blogId': createdBlog!.id
			}

			const post = await postsManagerTest.createPost(requestBody, accessToken!, StatusCodes.CREATED, createdBlog)

			const requestBody2 = {
				'title': 'abc',
				'shortDescription': 'abc',
				'content': 'abcd',
				'blogId': createdBlog!.id
			}

			if (post) {
				await postsManagerTest.updatePostById(post.id, accessToken!, requestBody2)
			}

		}
	})

	//TODO: тесты для delete post by id
	//todo: комментарии не должны от другого пользователя обновляться

	afterAll(async () => {
		db.stop()
	})

	afterAll(done => {
		done()
	})


})
