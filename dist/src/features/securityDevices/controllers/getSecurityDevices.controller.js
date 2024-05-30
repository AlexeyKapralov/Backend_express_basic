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
exports.getSecurityDevicesController = void 0;
const devicesService_1 = require("../service/devicesService");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const http_status_codes_1 = require("http-status-codes");
const jwt_service_1 = require("../../../common/adapters/jwt.service");
const getSecurityDevicesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const device = jwt_service_1.jwtService.decodeToken(refreshToken);
    if (!device) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
    }
    const result = yield devicesService_1.devicesService.getSecurityDevices(refreshToken);
    result.status == resultStatus_type_1.ResultStatus.Success
        ? res.status(http_status_codes_1.StatusCodes.OK).send(result.data)
        : res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
});
exports.getSecurityDevicesController = getSecurityDevicesController;
