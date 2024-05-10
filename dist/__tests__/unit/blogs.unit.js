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
const globals_1 = require("@jest/globals");
const blogs_repository_1 = require("../../src/repositories/blogs/blogs.repository");
const blogs_service_1 = require("../../src/service/blogs.service");
const resultStatus_type_1 = require("../../src/common/types/resultStatus.type");
describe('Test for createBlog method in blogsService', () => {
    afterEach(() => {
        globals_1.jest.clearAllMocks();
    });
    it('unit test for create a new blog from blogService', () => __awaiter(void 0, void 0, void 0, function* () {
        // Подготавливаем данные для теста
        const mockInputData = {
            name: 'Test Blog',
            description: 'This is a test blog',
            websiteUrl: 'http://testblog.com',
        };
        const mockBlogDbModel = {
            _id: globals_1.expect.any(String),
            name: mockInputData.name,
            description: mockInputData.description,
            websiteUrl: mockInputData.websiteUrl,
            createdAt: globals_1.expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            isMembership: false,
        };
        //искусственный возврат из репозитория
        blogs_repository_1.blogsRepository.createBlog = globals_1.jest.fn().mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return true;
        }));
        // Вызываем метод createBlog из blogsService с фиктивными данными
        const result = yield blogs_service_1.blogsService.createBlog(mockInputData);
        // Проверяем, что метод createBlog был вызван с ожидаемыми данными
        (0, globals_1.expect)(blogs_repository_1.blogsRepository.createBlog).toHaveBeenCalledWith(mockBlogDbModel);
        // Проверяем, что метод вернул ожидаемый результат
        (0, globals_1.expect)(result).toEqual({
            status: resultStatus_type_1.ResultStatus.Success,
            data: {
                id: globals_1.expect.any(String),
                name: mockInputData.name,
                description: mockInputData.description,
                websiteUrl: mockInputData.websiteUrl,
                createdAt: globals_1.expect.any(String),
                isMembership: false
            }
        });
    }));
});
