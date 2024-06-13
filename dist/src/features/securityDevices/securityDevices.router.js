"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityDevicesRouter = void 0;
const express_1 = require("express");
const checkCookie_middleware_1 = require("../../middlewares/checkCookie.middleware");
const ioc_1 = require("../../ioc");
const securityDevices_controller_1 = require("./securityDevices.controller");
exports.securityDevicesRouter = (0, express_1.Router)({});
const securityDevicesController = ioc_1.container.resolve(securityDevices_controller_1.SecurityDevicesController);
exports.securityDevicesRouter.get(`/devices`, checkCookie_middleware_1.checkCookieMiddleware, securityDevicesController.getSecurityDevices.bind(securityDevicesController));
exports.securityDevicesRouter.delete(`/devices`, checkCookie_middleware_1.checkCookieMiddleware, securityDevicesController.deleteSecurityDevices.bind(securityDevicesController));
exports.securityDevicesRouter.delete(`/devices/:deviceId`, checkCookie_middleware_1.checkCookieMiddleware, securityDevicesController.deleteSecurityDeviceById.bind(securityDevicesController));
