"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = require("supertest");
const app_1 = require("../src/app");
const http_status_codes_1 = require("http-status-codes");
describe('app', () => {
    it('should return "All is working"', () => {
        (0, supertest_1.agent)(app_1.app).get('/').expect(http_status_codes_1.StatusCodes.OK).expect('All is working');
    });
});
