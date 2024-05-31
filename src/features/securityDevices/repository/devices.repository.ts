import {db} from "../../../db/db";
import {IDeviceModel} from "../../../common/types/devices.model";
import {DeviceModel} from "../domain/devices.dto";

export const devicesRepository = {
    async findDeviceId(userId: string, ip: string, deviceName: string) {
        const device = await DeviceModel.findOne({userId, ip, deviceName})

        return device ? device.deviceId : null
    },
    async findDevice(device: IDeviceModel): Promise<IDeviceModel | null> {
        const deviceDb: IDeviceModel[] = await DeviceModel.aggregate( [
            { $match:
                {
                    userId: device.userId,
                    ip: device.ip,
                    deviceId: device.deviceId,
                    deviceName: device.deviceName,
                    iat: device.iat,
                    expirationDate: device.expirationDate
                }
            },
            {$project: {_ip:0} }
        ])

        return deviceDb[0]
    },
    async findDeviceById(deviceId: string) {
        const device = await DeviceModel.findOne({deviceId})
        return device ? device : null
    },
    async createOrUpdateDevice(device: IDeviceModel) {
        const foundDeviceId = await this.findDeviceId(device.userId, device.ip, device.deviceName)

        if (foundDeviceId) {
            const isUpdatedDevice = await DeviceModel.updateOne(
                {userId: device.userId, ip: device.ip, deviceName: device.deviceName, deviceId: foundDeviceId},
                {$set: {iat: device.iat, expirationDate: device.expirationDate}}
            )
            return isUpdatedDevice.modifiedCount > 0
        } else {
            return await DeviceModel.create(device)
        }
    },
    async deleteDeviceById(deviceId: string) {

        const result = await DeviceModel.deleteOne(
            {deviceId: deviceId},
        )
        return result.deletedCount > 0

    },
    async deleteAllAnotherDevices(device: IDeviceModel) {
        const isDeleted = await DeviceModel.deleteMany({
            userId: device.userId,
            deviceId: {$ne: device.deviceId}
        })

        return isDeleted.acknowledged
    }
}