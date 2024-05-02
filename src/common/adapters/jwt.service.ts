import jwt from "jsonwebtoken";
import {SETTINGS} from "../config/settings";
import {IUserViewModel} from "../../features/users/models/userView.model";


export const jwtService = {
    createJwt(user: IUserViewModel): string {
        return jwt.sign({userId: user.id}, SETTINGS.SECRET_JWT, {expiresIn: "1h"});
    },
    getUserIdByToken(token: string): string | null {
        try {
            const result: any = jwt.verify(token, SETTINGS.SECRET_JWT)
            return result.userId
        } catch (e) {
            return null
        }
    }
}