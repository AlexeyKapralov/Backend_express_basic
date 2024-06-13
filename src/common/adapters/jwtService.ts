import jwt from "jsonwebtoken";
import {SETTINGS} from "../config/settings";
import {injectable} from "inversify";

@injectable()
export class JwtService {
    createAccessToken(userId: string): string {
        return jwt.sign({userId}, SETTINGS.SECRET_JWT, {expiresIn: SETTINGS.EXPIRATION.ACCESS_TOKEN});
    }
    createRefreshToken(deviceId: string, userId: string): string {
        return jwt.sign({deviceId, userId}, SETTINGS.SECRET_JWT, {expiresIn: SETTINGS.EXPIRATION.REFRESH_TOKEN});
    }
    getUserIdByToken(token: string): string | null {
        try {
            const result: any = jwt.verify(token, SETTINGS.SECRET_JWT)
            return result.userId
        } catch (e) {
            return null
        }
    }
    verifyAndDecodeToken(token: string) {
        try {
            const result:any = jwt.verify(token, SETTINGS.SECRET_JWT)

            return {
                deviceId: result.deviceId,
                userId: result.userId,
                iat: result.iat,
                exp: result.exp
            }
        } catch (e) {
            return null
        }
    }
    checkRefreshToken(token: string): boolean {
        try {
            jwt.verify(token, SETTINGS.SECRET_JWT)
            return true
        } catch (e) {
            return false
        }
    }
}