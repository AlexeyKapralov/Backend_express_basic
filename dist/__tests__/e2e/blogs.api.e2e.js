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
const app_1 = require("../../src/app");
const settings_1 = require("../../src/settings");
const utils_1 = require("../../src/utils/utils");
const request = require('supertest');
describe('', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield request(app_1.app).delete(`${settings_1.SETTINGS.PATH.TESTS}/data`);
    }));
    it('should get blogs', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app_1.app)
            .get(`${settings_1.SETTINGS.PATH.BLOGS}`)
            .expect(utils_1.HTTP_STATUSES.OK_200)
            .expect([]);
    }));
});
