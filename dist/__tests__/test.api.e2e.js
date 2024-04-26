"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = require("supertest");
const app_1 = require("../src/app");
describe('user tests', () => {
    it('test', () => {
        (0, supertest_1.agent)(app_1.app).get('/').expect('All is running!');
    });
    afterAll(done => done());
});
