import {Request, Response} from "express";
import {loginService} from "../../../service/login.service";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";

export const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.status(StatusCodes.UNAUTHORIZED).send()
        return
    }

    const result = await loginService.logout(refreshToken)

    if (result.status === ResultStatus.Success) {
        res.status(StatusCodes.NO_CONTENT).json()
    }
    if (result.status === ResultStatus.BadRequest) {
        res.status(StatusCodes.UNAUTHORIZED).json()
    }
    if (result.status === ResultStatus.Unauthorized) {
        res.status(StatusCodes.UNAUTHORIZED).json(result.errorMessage)
    }
}