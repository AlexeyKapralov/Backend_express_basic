import {Request, Response} from "express";
import {loginService} from "../../../service/login.service";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {addSeconds} from "date-fns";

export const refreshTokenController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.status(StatusCodes.UNAUTHORIZED).send()
        return
    }

    const result = await loginService.refreshToken(refreshToken)
    if (result.status === ResultStatus.Success) {
        res.status(StatusCodes.OK)
            .cookie('refreshToken',result.data!.refreshToken, {httpOnly: true, secure: true, expires : addSeconds( new Date(), 20 )})
            .json({accessToken: result.data!.accessToken})
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json()
    }
}