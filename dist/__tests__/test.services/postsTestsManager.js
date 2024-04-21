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
exports.postsTestsManager = void 0;
const http_status_codes_1 = require("http-status-codes");
const settings_1 = require("../../src/settings");
const supertest_1 = require("supertest");
const app_1 = require("../../src/app");
exports.postsTestsManager = {
    createPost(body_1, auth_1) {
        return __awaiter(this, arguments, void 0, function* (body, auth, expected_status = http_status_codes_1.StatusCodes.CREATED) {
            const buff = Buffer.from(auth, 'utf8');
            const decodedAuth = buff.toString('base64');
            return yield (0, supertest_1.agent)(app_1.app)
                .post(settings_1.SETTINGS.PATH.POSTS)
                .set('authorization', 'Basic ' + decodedAuth)
                .send(body)
                .expect(expected_status);
        });
    }
};
