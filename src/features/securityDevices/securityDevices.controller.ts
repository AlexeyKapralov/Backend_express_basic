import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {JwtService} from "../../common/adapters/jwtService";
import {StatusCodes} from "http-status-codes";
import {ResultStatus} from "../../common/types/resultStatus.type";
import {DevicesService} from "./service/devicesService";

@injectable()
export class SecurityDevicesController {
    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(DevicesService) protected devicesService: DevicesService,
    ) {
    }

    async deleteSecurityDeviceById (req: Request<{deviceId: string}>, res: Response) {
        const refreshToken = req.cookies.refreshToken

        const userId = this.jwtService.getUserIdByToken(refreshToken)
        if (!userId) {
            res.status(StatusCodes.FORBIDDEN).send()
            return
        }

        const result = await this.devicesService.deleteDevice(req.params.deviceId, userId)

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

    async deleteSecurityDevices (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken

        const tokenPayload = this.jwtService.verifyAndDecodeToken(refreshToken)
        if (!tokenPayload) {
            res.status(StatusCodes.UNAUTHORIZED).send()
            return
        }

        const result = await this.devicesService.deleteAllSecurityDevices(tokenPayload.deviceId, tokenPayload.userId)

        result.status === ResultStatus.Success
            ? res.status(StatusCodes.NO_CONTENT).send()
            : res.status(StatusCodes.UNAUTHORIZED).send()
    }

    async getSecurityDevices (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken

        const device = this.jwtService.verifyAndDecodeToken(refreshToken)

        if (!device) {
            res.status(StatusCodes.UNAUTHORIZED).send()
            return
        }
        const result = await this.devicesService.getSecurityDevices(device.userId)

        result.status == ResultStatus.Success
            ? res.status(StatusCodes.OK).send(result.data)
            : res.status(StatusCodes.UNAUTHORIZED).send()
    }
}