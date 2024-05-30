import {Request, Response} from "express";
import {loginService} from "../service/login.service";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {addSeconds} from "date-fns";
import {SETTINGS} from "../../../common/config/settings";
import {setCookie} from "../../../common/utils/generators";
export const refreshTokenController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const result = await loginService.refreshToken(refreshToken)
    if (result.status === ResultStatus.Success) {
        setCookie(res, result.data!.refreshToken)
        res.status(StatusCodes.OK)
            .send({accessToken: result.data!.accessToken})
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json()
    }
}