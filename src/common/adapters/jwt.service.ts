import jwt from "jsonwebtoken";
import {SETTINGS} from "../config/settings";

export const jwtService = {
    createAccessToken(userId: string): string {
        return jwt.sign({userId: userId}, SETTINGS.SECRET_JWT, {expiresIn: "10s"});
    },
    createRefreshToken(userId: string): string {
        return jwt.sign({userId: userId}, SETTINGS.SECRET_JWT, {expiresIn: "20s"});
    },
    getUserIdByToken(token: string): string | null {
        try {
            const result: any = jwt.verify(token, SETTINGS.SECRET_JWT)
            return result.userId
        } catch (e) {
            return null
        }
    },
    checkRefreshToken(token: string): boolean {
        try {
            const result: any = jwt.verify(token, SETTINGS.SECRET_JWT)
            return true
        } catch (e) {
            return false
        }
    }
}