import {JwtService} from "../../../src/common/adapters/jwtService";
import {IDeviceDbModel} from "../../../src/features/securityDevices/models/deviceDb.model";
import {container} from "../../../src/ioc";

describe( 'refresh token test', () => {
    const jwtService = container.resolve(JwtService)

    it.skip('should refresh token', () => {

        jwtService.verifyAndDecodeToken = jest.fn().mockImplementation(():IDeviceDbModel => {
            return{
                deviceId : '123',
                userId: '1',
                iat: '2024-05-26T11:04:09.958Z',
                ip: '1.1.1.1',
                deviceName: 'a',
                exp: '2024-05-26T11:05:09.958Z'
            }
        })
    });
})