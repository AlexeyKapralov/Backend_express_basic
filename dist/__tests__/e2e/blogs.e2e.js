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
const supertest_1 = require("supertest");
const app_1 = require("../../src/app");
const blogsTestManager_1 = require("../utils/blogsTestManager");
const settings_1 = require("../../src/settings");
describe('', () => {
    it('should get version', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app)
            .get('/')
            .expect({ version: '1' });
    }));
    it('should create blog', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { name: "new blog", websiteUrl: "https://someurl.com", description: "description" };
        yield blogsTestManager_1.blogsTestManager.createBlog(data, settings_1.SETTINGS.ADMIN_AUTH);
    }));
});
