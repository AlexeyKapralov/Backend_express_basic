import {Request, Response} from "express"
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {jwtService} from "../../../common/adapters/jwt.service";
import {devicesService} from "../devicesCompositionRoot";

export const deleteSecurityDevicesController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const tokenPayload = jwtService.verifyAndDecodeToken(refreshToken)
    if (!tokenPayload) {
        res.status(StatusCodes.UNAUTHORIZED).send()
        return
    }

    const result = await devicesService.deleteAllSecurityDevices(tokenPayload.deviceId, tokenPayload.userId)

    result.status === ResultStatus.Success
        ? res.status(StatusCodes.NO_CONTENT).send()
        : res.status(StatusCodes.UNAUTHORIZED).send()
}