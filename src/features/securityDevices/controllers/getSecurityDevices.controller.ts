import {Request, Response} from "express";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {jwtService} from "../../../common/adapters/jwt.service";
import {devicesService} from "../devicesCompositionRoot";

export const getSecurityDevicesController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const device = jwtService.verifyAndDecodeToken(refreshToken)

    if (!device) {
        res.status(StatusCodes.UNAUTHORIZED).send()
        return
    }
    const result = await devicesService.getSecurityDevices(device.userId)

    result.status == ResultStatus.Success
        ? res.status(StatusCodes.OK).send(result.data)
        : res.status(StatusCodes.UNAUTHORIZED).send()
}