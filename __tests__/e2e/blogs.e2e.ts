import {agent as request} from "supertest";
import {app} from "../../src/app";
import {blogsTestManager} from "../utils/blogsTestManager";
import {SETTINGS} from "../../src/settings";
import {StatusCodes} from "http-status-codes";
import {blogsRepository} from "../../src/repositories/blogs.repository";

describe('', () => {
    beforeAll(async () => {
        await request(app).delete(SETTINGS.PATH.TEST_DELETE)
    })

    it('should get version', async () => {
        await request(app)
            .get('/')
            .expect('All is running')
    })

    it('should get blogs', async () => {
        await request(app)
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)
            .expect([])
    })

    it('shouldn\'t create blog', async () => {
        const data = {
            name: "stringstringstring",
            description: "stringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstringsgstringstrin",
            websiteUrl: "https://MtQPC9zxc"
        }
        const {response} = await blogsTestManager.createBlog(data, SETTINGS.ADMIN_AUTH, StatusCodes.BAD_REQUEST)

        // return expect(response.status).toBe(StatusCodes.BAD_REQUEST)
        return expect(response.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: "name"
                    },
                    {
                        message: expect.any(String),
                        field: "description"
                    },
                    {
                        message: expect.any(String),
                        field: "websiteUrl"
                    }
                ]
            }
        )

    })

    let blogGlobalId: string
    it('should create blog and update', async () => {
        const data = {
            name: "string",
            description: "string",
            websiteUrl: "https://MtQPC9.ru"
        }
        const {
            response,
            createdBlog
        } = await blogsTestManager.createBlog(data, SETTINGS.ADMIN_AUTH, StatusCodes.CREATED)

        expect(response.status).toBe(StatusCodes.CREATED)

        const result = await blogsRepository.getBlogs()
        expect(result).toEqual([createdBlog])

        const receivedBlogById = await blogsTestManager.getBlogById(createdBlog.id)

        expect(receivedBlogById.body).toEqual(createdBlog)

        const dataForUpdate = {
            name: "stringsing",
            description: "stringstring",
            websiteUrl: "https://MtQPC9zxc.ru"
        }

        const updatedBlogResponse = await blogsTestManager.updateBlog(dataForUpdate, receivedBlogById.body.id, SETTINGS.ADMIN_AUTH, StatusCodes.NO_CONTENT)

        expect(updatedBlogResponse.status).toBe(StatusCodes.NO_CONTENT)

        blogGlobalId = receivedBlogById.body.id
    })

    it('no delete blog with incorrect id', async () => {
        const isDeleted = await blogsTestManager.deleteBlog('xzczxc', SETTINGS.ADMIN_AUTH, StatusCodes.NOT_FOUND)

        expect(isDeleted).toBe(true)
    })

    it('no delete blog with correct id', async () => {
        const isDeleted = await blogsTestManager.deleteBlog(blogGlobalId, SETTINGS.ADMIN_AUTH, StatusCodes.NO_CONTENT)

        expect(isDeleted).toBe(true)
    })
})