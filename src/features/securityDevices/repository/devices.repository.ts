import {DeviceModel} from "../domain/devices.entity";
import {IDeviceDbModel} from "../models/deviceDb.model";

export class DevicesRepository {
    async findDeviceId(userId: string, ip: string, deviceName: string) {
        const device = await DeviceModel.findOne({userId, ip, deviceName})

        return device ? device.deviceId : null
    }
    async findDevice(deviceId: string, userId: string, iat: number): Promise<IDeviceDbModel | null> {

        const deviceDb: IDeviceDbModel[] = await DeviceModel.aggregate( [
            { $match:
                {
                    userId: userId,
                    deviceId: deviceId,
                    iat: String(iat)
                }
            },
            {$project: {_id:0} }
        ])

        return deviceDb[0]
    }
    async findDeviceById(deviceId: string) {
        const device = await DeviceModel.findOne({deviceId})
        return device ? device : null
    }
    async createOrUpdateDevice(device: IDeviceDbModel) {
        const foundDeviceId = await this.findDeviceId(device.userId, device.ip, device.deviceName)

        if (foundDeviceId) {

            const isUpdatedDevice = await DeviceModel.updateOne(
                {deviceId: foundDeviceId},
                {$set: {iat: String(device.iat), exp: String( device.exp )}}
            )

            return isUpdatedDevice.modifiedCount > 0
        } else {

            return await DeviceModel.create(device)
        }
    }
    async deleteDeviceById(deviceId: string) {

        const result = await DeviceModel.deleteOne(
            {deviceId: deviceId},
        )
        return result.deletedCount > 0

    }
    async deleteAllAnotherDevices(deviceId: string, userId: string) {
        const isDeleted = await DeviceModel.deleteMany({
            userId: userId,
            deviceId: {$ne: deviceId}
        })

        return isDeleted.acknowledged
    }
}