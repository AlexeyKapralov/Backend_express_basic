import {jwtService} from "../../../common/adapters/jwt.service";
import {IDeviceViewModel} from "../models/deviceView.model";
import {devicesQueryRepository} from "../repository/devices.queryRepository";
import {ResultType} from "../../../common/types/result.type";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {devicesRepository} from "../repository/devices.repository";
import {IDeviceModel} from "../../../common/types/devices.model";

export const devicesService = {
    async getDevice(device: IDeviceModel): Promise<ResultType<IDeviceModel | null>> {
        const result = await devicesRepository.findDevice(device)
        return result
            ? {
                status: ResultStatus.Success,
                data: result
            }
            : {
                status: ResultStatus.NotFound,
                data: null
            }

    },
    async getSecurityDevices(userId: string): Promise<ResultType<IDeviceViewModel[] | null>> {

        const devices = await devicesQueryRepository.getSecurityDevices(userId)

        if (!devices){
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }

        return {
            status: ResultStatus.Success,
            data: devices
        }

    },
    async deleteAllSecurityDevices(refreshToken: string): Promise<ResultType> {
        const device = jwtService.decodeToken(refreshToken)

        if (device) {
            if (await devicesRepository.deleteAllAnotherDevices(device)) {
                return {
                    status: ResultStatus.Success,
                    data: null
                }
            }
            return {
                status: ResultStatus.BadRequest,
                data: null
            }
        }
        return {
            status: ResultStatus.Unauthorized,
            data: null
        }

    },
    async deleteDevice(deviceId: string, refreshToken: string): Promise<ResultType>  {
        const userId = jwtService.getUserIdByToken(refreshToken)


        if (!userId) {
            return {
                status: ResultStatus.Unauthorized,
                data: null
            }
        }

        const device = await devicesRepository.findDeviceById(deviceId)

        if (!device) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }

        if (device.userId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null
            }
        }

        const isDeleted = await devicesRepository.deleteDeviceById(device.deviceId)

        return isDeleted
            ? {
                status: ResultStatus.Success,
                data: null
            }
            : {
                status: ResultStatus.Unauthorized,
                data: null
            }
    }
}