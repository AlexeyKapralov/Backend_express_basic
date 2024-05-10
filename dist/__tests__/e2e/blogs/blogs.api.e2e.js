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
const mongodb_memory_server_1 = require("mongodb-memory-server");
const db_1 = require("../../../src/db/db");
const supertest_1 = require("supertest");
const app_1 = require("../../../src/app");
describe('blogs tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongod = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongod.getUri();
        yield db_1.db.run(uri);
    }));
    it(`should get blogs with filter `, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.agent)(app_1.app)
            .get('/')
            .expect('All is running!');
        // .get(SETTINGS.PATH.BLOGS)
    }));
    //TODO: тесты для get (default pagination + custom) + должен быть пустой массив и пагинация если нет блогов
    //TODO: тесты для post (positive + negative)
    //TODO: тесты для get post by blog id
    //TODO: тесты для create post by blog id
    //TODO: тесты для get blog by id
    //TODO: тесты для put blog by id
    //TODO: тесты для delete blog by id
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db_1.db.stop();
    }));
    afterAll(done => {
        done();
    });
});
