"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityDevicesService = void 0;
const jwt_service_1 = require("../common/adapters/jwt.service");
const devices_queryRepository_1 = require("../repositories/devices/devices.queryRepository");
const resultStatus_type_1 = require("../common/types/resultStatus.type");
const devices_repository_1 = require("../repositories/devices/devices.repository");
exports.securityDevicesService = {
    getSecurityDevices(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = jwt_service_1.jwtService.getPayloadFromRefreshToken(refreshToken);
            if (device) {
                const result = yield devices_queryRepository_1.devicesQueryRepository.getSecurityDevices(device.userId);
                return {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: result
                };
            }
            return {
                status: resultStatus_type_1.ResultStatus.Unauthorized,
                data: null
            };
        });
    },
    deleteAllSecurityDevices(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = jwt_service_1.jwtService.getPayloadFromRefreshToken(refreshToken);
            if (device) {
                if (yield devices_repository_1.devicesRepository.deleteAllAnotherDevices(device)) {
                    return {
                        status: resultStatus_type_1.ResultStatus.Success,
                        data: null
                    };
                }
                return {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
            }
            return {
                status: resultStatus_type_1.ResultStatus.Unauthorized,
                data: null
            };
        });
    },
    deleteDevice(deviceId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = jwt_service_1.jwtService.getUserIdByToken(refreshToken);
            if (!userId) {
                return {
                    status: resultStatus_type_1.ResultStatus.Unauthorized,
                    data: null
                };
            }
            const device = yield devices_repository_1.devicesRepository.findDeviceById(deviceId);
            if (!device) {
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
            }
            if (device.userId !== userId) {
                return {
                    status: resultStatus_type_1.ResultStatus.Forbidden,
                    data: null
                };
            }
            const isDeleted = yield devices_repository_1.devicesRepository.deleteDeviceById(device.deviceId);
            return isDeleted
                ? {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: null
                }
                : {
                    status: resultStatus_type_1.ResultStatus.Unauthorized,
                    data: null
                };
        });
    }
};
