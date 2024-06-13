"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwtService_1 = require("../../../src/common/adapters/jwtService");
const ioc_1 = require("../../../src/ioc");
describe('refresh token test', () => {
    const jwtService = ioc_1.container.resolve(jwtService_1.JwtService);
    it.skip('should refresh token', () => {
        jwtService.verifyAndDecodeToken = jest.fn().mockImplementation(() => {
            return {
                deviceId: '123',
                userId: '1',
                iat: '2024-05-26T11:04:09.958Z',
                ip: '1.1.1.1',
                deviceName: 'a',
                exp: '2024-05-26T11:05:09.958Z'
            };
        });
    });
});
