import { agent as request } from 'supertest'
import { app } from '../src/app'
import { SETTINGS } from '../src/settings'
import { StatusCodes } from 'http-status-codes'
import { postRepository } from '../src/repositories/posts.repository'
import { blogsCollection, postsCollection } from '../src/db/db'
import { posts } from '../src/db/mock'
import { postsTestsManager } from './test.services/postsTestsManager'
import { ObjectId } from 'mongodb'
import { blogsRepository } from '../src/repositories/blogs.repository'

describe('tests for posts blog', () => {
	beforeAll(async () => {
		await request(app).delete(SETTINGS.PATH.TEST_DELETE)
	})
	it('should find all posts with default pagination', async () => {
		await request(app).get(SETTINGS.PATH.POSTS).expect(StatusCodes.NOT_FOUND)
	})
	it('should add array and get blogs with default pagination fields', async () => {
		const createdPosts = await postsCollection.insertMany(posts)

		if (createdPosts) {
			const res = await request(app)
				.get(SETTINGS.PATH.POSTS)
				.expect(StatusCodes.OK)

			expect(res.body).toEqual({
				pagesCount: 1,
				page: 1,
				pageSize: 10,
				totalCount: 3,
				items: expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(String),
						title: expect.any(String),
						shortDescription: expect.any(String),
						content: expect.any(String),
						blogId: expect.any(String),
						blogName: expect.any(String),
						createdAt: expect.any(String)
					})
				])
			})
		}
	})

	it("shouldn't create with incorrect data", async () => {
		const blog = {
			_id: String(new ObjectId()),
			name: 'test blog',
			description: 'test blog description11',
			websiteUrl: 'test blog url11',
			createdAt: String(new Date().toISOString()),
			isMembership: true
		}
		await blogsCollection.insertOne(blog)

		const body = {
			title: 'validvalidvalidvalidvalidvalidvalidvalid',
			content:
				'validvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalidvalid',
			blogId: blog._id,
			shortDescription:
				'length_11-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQxDnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx'
		}

		const res = await postsTestsManager.createPost(
			body,
			SETTINGS.ADMIN_AUTH,
			StatusCodes.BAD_REQUEST
		)

		expect(res.body).toEqual({
			errorsMessages: [
				{
					message: expect.any(String),
					field: 'title'
				},
				{
					message: expect.any(String),
					field: 'content'
				},
				{
					message: expect.any(String),
					field: 'shortDescription'
				}
			]
		})
	})
	it("shouldn't create with incorrect blog id", async () => {
		const body = {
			title: 'a',
			content: 'a',
			blogId: 'aa',
			shortDescription: 'a-a'
		}

		await postsTestsManager.createPost(
			body,
			SETTINGS.ADMIN_AUTH,
			StatusCodes.NOT_FOUND
		)
	})
	it("shouldn't create post with no auth", async () => {
		const blog = {
			_id: String(new ObjectId()),
			name: 'test blog',
			description: 'test blog description11',
			websiteUrl: 'test blog url11',
			createdAt: String(new Date().toISOString()),
			isMembership: true
		}

		await blogsCollection.insertOne(blog)

		const body = {
			title: 'a',
			content: 'a',
			blogId: blog._id,
			shortDescription: 'length_11-a'
		}

		await postsTestsManager.createPost(body, 'ss', StatusCodes.UNAUTHORIZED)
	})

	it('should create post', async () => {
		const blog = {
			_id: String(new ObjectId()),
			name: 'test blog',
			description: 'test blog description11',
			websiteUrl: 'test blog url11',
			createdAt: String(new Date().toISOString()),
			isMembership: true
		}

		await blogsCollection.insertOne(blog)

		const body = {
			title: 'a',
			content: 'a',
			blogId: blog._id,
			shortDescription: 'length_11-a'
		}

		const res = await postsTestsManager.createPost(
			body,
			SETTINGS.ADMIN_AUTH,
			StatusCodes.CREATED
		)

		expect(res.body).toEqual({
			id: expect.any(String),
			title: 'a',
			content: 'a',
			blogId: blog._id,
			blogName: expect.any(String),
			shortDescription: 'length_11-a',
			createdAt: expect.any(String)
		})
	})
})
