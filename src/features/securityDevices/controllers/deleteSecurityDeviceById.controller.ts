import {Request, Response} from "express";
import {devicesService} from "../service/devicesService";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";

export const deleteSecurityDeviceByIdController = async (req: Request<{deviceId: string}>, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    const result = await devicesService.deleteDevice(req.params.deviceId, refreshToken)


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