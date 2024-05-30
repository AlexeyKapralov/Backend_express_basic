import {db} from "../../../db/db";
import {IDeviceViewModel} from "../models/deviceView.model";

export const devicesQueryRepository = {
    async getSecurityDevices(userId: string): Promise<Array<IDeviceViewModel>> {
        return await db.getCollection().devices.aggregate([
            {$match: {userId}},
            {
                $project: {
                    _id: 0,
                    ip: 1,
                    title: '$deviceName',
                    lastActiveDate: '$iat',
                    deviceId: 1
                }
            }
        ]).toArray() as Array<IDeviceViewModel>
    }
}