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
const test_helpers_1 = require("./test-helpers");
// import {setDB} from '../src/db/db'
// import {dataset1} from './datasets'
const settings_1 = require("../src/settings");
describe('/videos', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // await req.delete('/testing/all-data')
    }));
    it('should get empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        // setDB()
        const res = yield test_helpers_1.req
            .get(settings_1.SETTINGS.PATH.VIDEOS)
            .expect(200);
        console.log(res.body);
        // expect(res.body.length).toBe(0)
    }));
    it('should get not empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        // setDB(dataset1)
        const res = yield test_helpers_1.req
            .get(settings_1.SETTINGS.PATH.VIDEOS)
            .expect(200);
        console.log(res.body);
        // expect(res.body.length).toBe(1)
        // expect(res.body[0]).toEqual(dataset1.videos[0])
    }));
    // ...
    // it('should create', async () => {
    //     setDB()
    //     const newVideo: InputVideoType = {
    //         title: 't1',
    //         author: 'a1',
    //         availableResolution: [Resolutions.P144]
    //         // ...
    //     }
    //
    //     const res = await req
    //         .post(PATH.VIDEOS)
    //         .send(newVideo) // отправка данных
    //         .expect(201)
    //
    //     expect(res.body.availableResolution).toEqual(newVideo.availableResolution)
    // ...
    // it('shouldn\'t find', async () => {
    //     setDB(dataset1)
    //
    //     const res = await req
    //         .get(PATH.VIDEOS + '/1')
    //         .expect(404) // проверка на ошибку
    // ...
});
