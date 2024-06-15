"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Mock-объект для blogsRepository, чтобы заменить его на управляемый тестами
// импорт container должен быть в самом начале
const ioc_1 = require("../../../src/ioc");
const resultStatus_type_1 = require("../../../src/common/types/resultStatus.type");
const blogs_repository_1 = require("../../../src/features/blogs/repository/blogs.repository");
const blogs_service_1 = require("../../../src/features/blogs/sevice/blogs.service");
describe('Test for createBlog method in blogsService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('unit test for create a new blog from blogService', () => __awaiter(void 0, void 0, void 0, function* () {
        const blogsService = ioc_1.container.resolve(blogs_service_1.BlogsService);
        // Подготавливаем данные для теста
        const mockInputData = {
            name: 'Test Blog',
            description: 'This is a test blog',
            websiteUrl: 'http://testblog.com',
        };
        //todo вопрос как возвращать mongoose модель
        const mockCreateBlog = jest.spyOn(blogs_repository_1.BlogsRepository.prototype, "createBlog").mockImplementation((body) => __awaiter(void 0, void 0, void 0, function* () {
            return {
                _id: 'asasd',
                name: mockInputData.name,
                description: mockInputData.description,
                websiteUrl: mockInputData.websiteUrl,
                createdAt: 'asdasd',
                isMembership: false,
            };
        }));
        const mockBlogDbModel = {
            _id: expect.any(String),
            name: mockInputData.name,
            description: mockInputData.description,
            websiteUrl: mockInputData.websiteUrl,
            createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            isMembership: false,
        };
        // Вызываем метод createBlog из blogsService с фиктивными данными
        const result = yield blogsService.createBlog(mockInputData);
        // Проверяем, что метод createBlog был вызван с ожидаемыми данными
        // expect(mockCreateBlog).toHaveBeenCalledWith(mockBlogDbModel);
        // Проверяем, что метод вернул ожидаемый результат
        expect(result).toEqual({
            status: resultStatus_type_1.ResultStatus.Success,
            data: {
                id: expect.any(String),
                name: mockInputData.name,
                description: mockInputData.description,
                websiteUrl: mockInputData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: false
            }
        });
    }));
});
