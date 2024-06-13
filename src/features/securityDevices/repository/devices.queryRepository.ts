import {IDeviceViewModel} from "../models/deviceView.model";
import {DeviceModel} from "../domain/devices.entity";
import {injectable} from "inversify";

@injectable()
export class DevicesQueryRepository {
    async getSecurityDevices(userId: string): Promise<Array<IDeviceViewModel>> {
        return DeviceModel.aggregate([
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
        ])
    }
}