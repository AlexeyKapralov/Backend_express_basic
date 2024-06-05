import {DevicesService} from "./service/devicesService";
import {DevicesRepository} from "./repository/devices.repository";
import {DevicesQueryRepository} from "./repository/devices.queryRepository";

const devicesQueryRepository = new DevicesQueryRepository()
const devicesRepository = new DevicesRepository()
export const devicesService = new DevicesService(devicesRepository, devicesQueryRepository)