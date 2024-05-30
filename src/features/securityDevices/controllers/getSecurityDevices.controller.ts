import {Request, Response} from "express";
import {devicesService} from "../service/devicesService";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {jwtService} from "../../../common/adapters/jwt.service";

export const getSecurityDevicesController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const device = jwtService.decodeToken(refreshToken)

    if (!device) {
        res.status(StatusCodes.UNAUTHORIZED).send()
    }
    const result = await devicesService.getSecurityDevices(refreshToken)

    result.status == ResultStatus.Success
        ? res.status(StatusCodes.OK).send(result.data)
        : res.status(StatusCodes.UNAUTHORIZED).send()
}