// Mock-объект для blogsRepository, чтобы заменить его на управляемый тестами
import {expect, jest} from '@jest/globals';
import {blogsRepository} from "../../../src/repositories/blogs/blogs.repository";
import {blogsService} from "../../../src/service/blogs.service";
import { ResultStatus } from '../../../src/common/types/resultStatus.type'

describe('Test for createBlog method in blogsService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('unit test for create a new blog from blogService', async () => {
        // Подготавливаем данные для теста
        const mockInputData = {
            name: 'Test Blog',
            description: 'This is a test blog',
            websiteUrl: 'http://testblog.com',
        }


        const mockBlogDbModel = {
            _id: expect.any(String),
            name: mockInputData.name,
            description: mockInputData.description,
            websiteUrl: mockInputData.websiteUrl,
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            isMembership: false,
        }

        //искусственный возврат из репозитория
        blogsRepository.createBlog = jest.fn<typeof blogsRepository.createBlog>().mockImplementation(async () => {
            return true
        })

        // Вызываем метод createBlog из blogsService с фиктивными данными
        const result = await blogsService.createBlog(mockInputData)

        // Проверяем, что метод createBlog был вызван с ожидаемыми данными
        expect(blogsRepository.createBlog).toHaveBeenCalledWith(mockBlogDbModel);

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
