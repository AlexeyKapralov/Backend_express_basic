import {Router} from "express";
import { getSecurityDevicesController} from "./controllers/getSecurityDevices.controller";
import {deleteSecurityDevicesController} from "./controllers/deleteSecurityDevices.controller";
import {deleteSecurityDeviceByIdController} from "./controllers/deleteSecurityDeviceById.controller";
import {checkCookieMiddleware} from "../../middlewares/checkCookie.middleware";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get(`/devices`, checkCookieMiddleware, getSecurityDevicesController)

securityDevicesRouter.delete(`/devices`, checkCookieMiddleware, deleteSecurityDevicesController)

securityDevicesRouter.delete(`/devices/:deviceId`, checkCookieMiddleware, deleteSecurityDeviceByIdController)