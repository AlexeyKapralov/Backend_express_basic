import {db} from "../../../db/db";
import {IDeviceModel} from "../../../common/types/devices.model";

export const devicesRepository = {
    async findDeviceId(userId: string, ip: string, deviceName: string) {
        const device = await db.getCollection().devices.findOne({userId, ip, deviceName})

        return device ? device.deviceId : null
    },
    async findDevice(device: IDeviceModel): Promise<IDeviceModel | null> {
        const deviceDb = await db.getCollection().devices.aggregate( [
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
        ]).toArray() as Array<IDeviceModel>

        return deviceDb[0]
    },
    async findDeviceById(deviceId: string) {
        const device = await db.getCollection().devices.findOne({deviceId})
        return device ? device : null
    },
    async createOrUpdateDevice(device: IDeviceModel) {
        const foundDeviceId = await this.findDeviceId(device.userId, device.ip, device.deviceName)

        if (foundDeviceId) {
            const isUpdatedDevice = await db.getCollection().devices.updateOne(
                {userId: device.userId, ip: device.ip, deviceName: device.deviceName, deviceId: foundDeviceId},
                {$set: {iat: device.iat, expirationDate: device.expirationDate}}
            )
            return isUpdatedDevice.modifiedCount > 0
        } else {
            const isCreatedDevice = await db.getCollection().devices.insertOne(device)
            return isCreatedDevice.acknowledged
        }
    },
    async deleteDeviceById(deviceId: string) {

        const result = await db.getCollection().devices.deleteOne(
            {deviceId: deviceId},
        )
        return result.deletedCount > 0

    },
    async deleteAllAnotherDevices(device: IDeviceModel) {
        const isDeleted = await db.getCollection().devices.deleteMany({
            userId: device.userId,
            deviceId: {$ne: device.deviceId}
        })

        return isDeleted.acknowledged
    }
}