import jwt from "jsonwebtoken";
import {SETTINGS} from "../config/settings";
import {IDeviceModel} from "../types/devices.model";

export const jwtService = {
    createAccessToken(userId: string): string {
        return jwt.sign({userId}, SETTINGS.SECRET_JWT, {expiresIn: "10s"});
    },
    createRefreshToken(device: Omit<IDeviceModel, 'iat' | 'expirationDate'>): string {
        return jwt.sign(device, SETTINGS.SECRET_JWT, {expiresIn: "20s"});
    },
    getUserIdByToken(token: string): string | null {
        try {
            const result: any = jwt.verify(token, SETTINGS.SECRET_JWT)
            return result.userId
        } catch (e) {
            return null
        }
    },
    //todo вопросики по корректности такого кода (как типизировать payload из JWT verify)
    getPayloadFromRefreshToken(token: string) {
        try {
            const result:any = jwt.verify(token, SETTINGS.SECRET_JWT)
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