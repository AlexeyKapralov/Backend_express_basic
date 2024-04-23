"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = require("supertest");
const src_1 = require("../src");
describe('test', () => {
    it('test', () => {
        (0, supertest_1.agent)(src_1.app).get('/').expect('Hello World!');
    });
});
