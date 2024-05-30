import jwt from "jsonwebtoken";
import {SETTINGS} from "../config/settings";
import {IDeviceModel} from "../types/devices.model";

export const jwtService = {
    createAccessToken(userId: string): string {
        return jwt.sign({userId}, SETTINGS.SECRET_JWT, {expiresIn: SETTINGS.EXPIRATION.ACCESS_TOKEN});
    },
    //todo переписать чтобы хранился только device Id и userId
    createRefreshToken(device: Omit<IDeviceModel, 'iat' | 'expirationDate'>): string {
        return jwt.sign(device, SETTINGS.SECRET_JWT, {expiresIn: SETTINGS.EXPIRATION.REFRESH_TOKEN});
    },
    getUserIdByToken(token: string): string | null {
        try {
            const result: any = jwt.verify(token, SETTINGS.SECRET_JWT)
            return result.userId
        } catch (e) {
            return null
        }
    },
    decodeToken(token: string) {
        try {
            const result:any = jwt.decode(token)
            return {
                deviceId: result.deviceId,
                userId: result.userId,
                deviceName: result.deviceName,
                iat: new Date(result.iat * 1000).toISOString(),
                ip: result.ip,
                expirationDate: new Date(result.exp * 1000).toISOString()
            } as IDeviceModel
        } catch (e) {
            return null
        }
    },
    checkRefreshToken(token: string): boolean {
        try {
            jwt.verify(token, SETTINGS.SECRET_JWT)
            return true
        } catch (e) {
            return false
        }
    }
}