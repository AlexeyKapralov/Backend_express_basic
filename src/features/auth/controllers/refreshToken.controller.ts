import {Request, Response} from "express";
import {authService} from "../service/auth.service";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {setCookie} from "../../../common/utils/generators";
import {jwtService} from "../../../common/adapters/jwt.service";
export const refreshTokenController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const tokenPayload = jwtService.verifyAndDecodeToken(refreshToken)
    if (!tokenPayload) {
        res.status(StatusCodes.UNAUTHORIZED).json()
        return
    }

    const result = await authService.refreshToken(tokenPayload.deviceId, tokenPayload.userId, tokenPayload.iat)
    if (result.status === ResultStatus.Success) {
        setCookie(res, result.data!.refreshToken)
        res.status(StatusCodes.OK)
            .send({accessToken: result.data!.accessToken})
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json()
    }
}