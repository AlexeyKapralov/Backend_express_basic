import {Request, Response} from "express";
import {loginService} from "../../../service/login.service";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";

export const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const result = await loginService.logout(refreshToken)

    result.status === ResultStatus.Success ? res.status(StatusCodes.NO_CONTENT).json() : res.status(StatusCodes.UNAUTHORIZED).json()
}