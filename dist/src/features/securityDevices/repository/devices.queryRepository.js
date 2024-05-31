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
exports.devicesQueryRepository = void 0;
const devices_dto_1 = require("../domain/devices.dto");
exports.devicesQueryRepository = {
    getSecurityDevices(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return devices_dto_1.DeviceModel.aggregate([
                { $match: { userId } },
                {
                    $project: {
                        _id: 0,
                        ip: 1,
                        title: '$deviceName',
                        lastActiveDate: '$iat',
                        deviceId: 1
                    }
                }
            ]);
        });
    }
};
