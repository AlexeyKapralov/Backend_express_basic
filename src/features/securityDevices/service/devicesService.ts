import {IDeviceViewModel} from "../models/deviceView.model";
import {devicesQueryRepository} from "../repository/devices.queryRepository";
import {ResultType} from "../../../common/types/result.type";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {devicesRepository} from "../repository/devices.repository";
import {IDeviceDbModel} from "../models/deviceDb.model";

export const devicesService = {
    async getDevice(deviceId: string, userId: string, iat: number): Promise<ResultType<IDeviceDbModel | null>> {
        const result = await devicesRepository.findDevice(deviceId, userId, iat)
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
    async deleteAllSecurityDevices(deviceId: string, userId: string): Promise<ResultType> {

        if (await devicesRepository.deleteAllAnotherDevices(deviceId, userId)) {
            return {
                status: ResultStatus.Success,
                data: null
            }
        }
        return {
            status: ResultStatus.BadRequest,
            data: null
        }

    },
    async deleteDevice(deviceId: string, userId: string): Promise<ResultType>  {

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