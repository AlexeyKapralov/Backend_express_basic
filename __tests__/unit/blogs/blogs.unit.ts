// Mock-объект для blogsRepository, чтобы заменить его на управляемый тестами
// импорт container должен быть в самом начале
import {container} from "../../../src/ioc";
import {ResultStatus} from '../../../src/common/types/resultStatus.type'
import {BlogsRepository} from "../../../src/features/blogs/repository/blogs.repository";
import {BlogsService} from "../../../src/features/blogs/sevice/blogs.service";
import {IBlogDbModel} from "../../../src/features/blogs/models/blogDb.model";
import {HydratedDocument} from "mongoose";

describe('Test for createBlog method in blogsService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('unit test for create a new blog from blogService', async () => {
        const blogsService = container.resolve(BlogsService)
        // Подготавливаем данные для теста
        const mockInputData = {
            name: 'Test Blog',
            description: 'This is a test blog',
            websiteUrl: 'http://testblog.com',
        }


        //todo вопрос как возвращать mongoose модель
        const mockCreateBlog = jest.spyOn(BlogsRepository.prototype, "createBlog").mockImplementation(async (body: typeof mockInputData) => {
            return {
                _id: 'asasd',
                name: mockInputData.name,
                description: mockInputData.description,
                websiteUrl: mockInputData.websiteUrl,
                createdAt: 'asdasd',
                isMembership: false,
            } as HydratedDocument<IBlogDbModel>
        });


        const mockBlogDbModel = {
            _id: expect.any(String),
            name: mockInputData.name,
            description: mockInputData.description,
            websiteUrl: mockInputData.websiteUrl,
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            isMembership: false,
        }

        // Вызываем метод createBlog из blogsService с фиктивными данными
        const result = await blogsService.createBlog(mockInputData)

        // Проверяем, что метод createBlog был вызван с ожидаемыми данными
        // expect(mockCreateBlog).toHaveBeenCalledWith(mockBlogDbModel);

        // Проверяем, что метод вернул ожидаемый результат
        expect(result).toEqual({
            status: ResultStatus.Success,
            data: {
                id: expect.any(String),
                name: mockInputData.name,
                description: mockInputData.description,
                websiteUrl: mockInputData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: false
            }

        })
    })
})
