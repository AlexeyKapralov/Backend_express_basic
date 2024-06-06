import {Request, Response} from "express";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {jwtService} from "../../../common/adapters/jwt.service";
import {devicesService} from "../devicesCompositionRoot";

export const deleteSecurityDeviceByIdController = async (req: Request<{deviceId: string}>, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const userId = jwtService.getUserIdByToken(refreshToken)
    if (!userId) {
        res.status(StatusCodes.FORBIDDEN).send()
        return
    }

    const result = await devicesService.deleteDevice(req.params.deviceId, userId)

    if (result.status === ResultStatus.Success) {
        res.status(StatusCodes.NO_CONTENT).send()
    }
    if (result.status === ResultStatus.NotFound) {
        res.status(StatusCodes.NOT_FOUND).send()
    }
    if (result.status === ResultStatus.Forbidden) {
        res.status(StatusCodes.FORBIDDEN).send()
    }
    if (result.status === ResultStatus.Unauthorized) {
        res.status(StatusCodes.UNAUTHORIZED).send()
    }
}