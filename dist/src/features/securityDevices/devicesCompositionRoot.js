"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicesService = void 0;
const devicesService_1 = require("./service/devicesService");
const devices_repository_1 = require("./repository/devices.repository");
const devices_queryRepository_1 = require("./repository/devices.queryRepository");
const devicesQueryRepository = new devices_queryRepository_1.DevicesQueryRepository();
const devicesRepository = new devices_repository_1.DevicesRepository();
exports.devicesService = new devicesService_1.DevicesService(devicesRepository, devicesQueryRepository);
