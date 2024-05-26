"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_service_1 = require("../../../src/common/adapters/jwt.service");
describe('refresh token test', () => {
    it.skip('should refresh token', () => {
        jwt_service_1.jwtService.getPayloadFromRefreshToken = jest.fn().mockImplementation(() => {
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
// async refreshToken(refreshToken: string): Promise<ResultType<{
//     accessToken: string,
//     refreshToken: string
// } | null>> {
//
//     const deviceInfo = jwtService.getPayloadFromRefreshToken(refreshToken)
//
//     let device
//     if (deviceInfo) {
//         device = await db.getCollection().devices.findOne({
//             deviceId: deviceInfo.deviceId,
//             ip: deviceInfo.ip,
//             iat: deviceInfo.iat,
//             expirationDate: deviceInfo.expirationDate,
//             userId: deviceInfo.userId
//         })
//     }
//
//     if (device) {
//
//         const newAccessToken = jwtService.createAccessToken(device.userId)
//         const newRefreshToken = jwtService.createRefreshToken(device)
//
//         return {
//             status: ResultStatus.Success,
//             data: {accessToken: newAccessToken, refreshToken: newRefreshToken}
//         }
//     }
//
//     return {
//         status: ResultStatus.Unauthorized,
//         data: null
//     }
// }
