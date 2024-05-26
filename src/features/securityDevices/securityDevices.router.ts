import {Router} from "express";
import { getSecurityDevicesController} from "./controllers/getSecurityDevices.controller";
import {deleteSecurityDevicesController} from "./controllers/deleteSecurityDevices.controller";
import {deleteSecurityDeviceByIdController} from "./controllers/deleteSecurityDeviceById.controller";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get(`/devices`, getSecurityDevicesController)

securityDevicesRouter.delete(`/devices`, deleteSecurityDevicesController)

securityDevicesRouter.delete(`/devices/:deviceId`, deleteSecurityDeviceByIdController)