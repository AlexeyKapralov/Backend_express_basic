import {Request, Response} from "express"
import {devicesService} from "../../../service/devicesService";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";

export const deleteSecurityDevicesController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.status(StatusCodes.UNAUTHORIZED).send()
        return
    }

    const result = await devicesService.deleteAllSecurityDevices(refreshToken)

    result.status === ResultStatus.Success
        ? res.status(StatusCodes.NO_CONTENT).send()
        : res.status(StatusCodes.UNAUTHORIZED).send()
}