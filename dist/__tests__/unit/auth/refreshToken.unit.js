"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_service_1 = require("../../../src/common/adapters/jwt.service");
describe('refresh token test', () => {
    it.skip('should refresh token', () => {
        jwt_service_1.jwtService.decodeToken = jest.fn().mockImplementation(() => {
            return {
                deviceId: '123',
                userId: '1',
                iat: '2024-05-26T11:04:09.958Z',
                ip: '1.1.1.1',
                deviceName: 'a',
                expirationDate: '2024-05-26T11:05:09.958Z'
            };
        });
    });
});
