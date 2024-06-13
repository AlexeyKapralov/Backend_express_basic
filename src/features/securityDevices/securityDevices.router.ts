import {Router} from "express";
import {checkCookieMiddleware} from "../../middlewares/checkCookie.middleware";
import {container} from "../../ioc";
import {SecurityDevicesController} from "./securityDevices.controller";

export const securityDevicesRouter = Router({})
const securityDevicesController = container.resolve(SecurityDevicesController)

securityDevicesRouter.get(`/devices`, checkCookieMiddleware, securityDevicesController.getSecurityDevices.bind(securityDevicesController))

securityDevicesRouter.delete(`/devices`, checkCookieMiddleware, securityDevicesController.deleteSecurityDevices.bind(securityDevicesController) )

securityDevicesRouter.delete(`/devices/:deviceId`, checkCookieMiddleware, securityDevicesController.deleteSecurityDeviceById.bind(securityDevicesController) )