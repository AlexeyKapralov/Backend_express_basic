import { MongoMemoryServer } from 'mongodb-memory-server'
import { db } from '../../../src/db/db'
import { agent } from 'supertest'
import { app } from '../../../src/app'
import { SETTINGS } from '../../../src/common/config/settings'
import { getBlogViewModel } from '../../../src/common/utils/mappers'
import { blogsManagerTest } from './blogsManager.test'
import { IBlogViewModel } from '../../../src/features/blogs/models/blogView.model'
import { IQueryModel } from '../../../src/common/types/query.model'
import { authManagerTest } from '../auth/authManager.test'
import { IBlogInputModel } from '../../../src/features/blogs/models/blogInput.model'
import { StatusCodes } from 'http-status-codes'
import { IBlogDbModel } from '../../../src/features/blogs/models/blogDb.model'

describe('blogs tests', () => {
	beforeAll(async () => {
		const mongod = await MongoMemoryServer.create()
		const uri = mongod.getUri()
		await db.run(uri)
	})

	beforeEach(async () => {
		await db.drop()
	})

	it(`should get blogs with filter `, async () => {
		await agent(app)
			.get('/')
			.expect('All is running!')
	})

	it('should get blogs with default pagination and empty array', async () => {
		const res = await agent(app)
			.get(SETTINGS.PATH.BLOGS)

		expect(res.body).toEqual({
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: []
		})
	})

	it('should get blogs with custom pagination', async () => {
		await blogsManagerTest.createBlogs(40)

		const query: IQueryModel = {
			searchNameTerm: 'lo',
			pageNumber: 2,
			pageSize: 5,
			sortBy: 'description',
			sortDirection: 'asc'
		}

		const res = await agent(app)
			.get(SETTINGS.PATH.BLOGS)
			.query(query)

		const totalCount = await db.getCollection().blogsCollection
			.countDocuments({ name: { $regex: query.searchNameTerm, $options: 'i' } })

		const blogs = await db.getCollection().blogsCollection
			.find({ name: { $regex: query.searchNameTerm, $options: 'i' } })
			.sort(query.sortBy!, query.sortDirection)
			.skip((query.pageNumber! - 1) * query.pageSize!)
			.limit(query.pageSize!)
			.toArray()

		expect(res.body).toEqual({
			pagesCount: Math.ceil((totalCount / query.pageSize!)),
			page: query.pageNumber,
			pageSize: query.pageSize,
			totalCount: totalCount,
			items: expect.arrayContaining(
				[
					expect.objectContaining<IBlogViewModel>(
						{
							createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
							description: expect.any(String),
							id: expect.any(String),
							isMembership: expect.any(Boolean),
							name: expect.any(String),
							websiteUrl: expect.any(String)
						})
				])
		})
		expect(blogs.map(getBlogViewModel)).toEqual(res.body.items)
	})

	//тесты для post (positive + negative)
	it(`shouldn't create blog with no auth`, async () => {
		await blogsManagerTest.createBlog('default', 'accessToken', StatusCodes.UNAUTHORIZED)
	})

	it(`shouldn't create blog with no correct data`, async () => {
		const tokens = await authManagerTest.createAndAuthUser()
		let accessToken
		tokens ?  accessToken = tokens.accessToken : accessToken = ''
		const data: IBlogInputModel = {
			'name': '',
			'description': '',
			'websiteUrl': 'ttp://oBAS8Qf.ru'
		}
		if (accessToken) {
			const result = await blogsManagerTest.createBlog(data, accessToken, StatusCodes.BAD_REQUEST)
			expect(result).toEqual(
				{
					"errorsMessages": expect.arrayContaining([
						{
							"message": expect.any(String),
							"field": expect.any(String)
						}
					])
				}
			)
		}
	})
	it(`should create blog`, async () => {
		const tokens = await authManagerTest.createAndAuthUser()
		let accessToken
		tokens ?  accessToken = tokens.accessToken : accessToken = ''
		const data: IBlogInputModel = {
			'name': 'timma',
			'description': 'bbbbb',
			'websiteUrl': 'https://oBAS8Qf.ru'
		}
		if (accessToken) {
			await blogsManagerTest.createBlog(data, accessToken)
		}

		const blog = await db.getCollection().blogsCollection.findOne({name: data.name})

		expect(blog).toEqual<IBlogDbModel>({
			createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
			_id: expect.any(String),
			name: data.name,
			description: data.description,
			websiteUrl: data.websiteUrl,
			isMembership: expect.any(Boolean)
		})
	})
	//TODO: тесты для get post by blog id
	//TODO: тесты для create post by blog id
	//TODO: тесты для get blog by id
	//TODO: тесты для put blog by id
	//TODO: тесты для delete blog by id

	afterAll(async () => {
		db.stop()
	})

	afterAll(done => {
		done()
	})


})
