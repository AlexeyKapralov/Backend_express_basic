"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.SecurityDevicesController = void 0;
const inversify_1 = require("inversify");
const jwtService_1 = require("../../common/adapters/jwtService");
const http_status_codes_1 = require("http-status-codes");
const resultStatus_type_1 = require("../../common/types/resultStatus.type");
const devicesService_1 = require("./service/devicesService");
let SecurityDevicesController = class SecurityDevicesController {
    constructor(jwtService, devicesService) {
        this.jwtService = jwtService;
        this.devicesService = devicesService;
    }
    deleteSecurityDeviceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const userId = this.jwtService.getUserIdByToken(refreshToken);
            if (!userId) {
                res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send();
                return;
            }
            const result = yield this.devicesService.deleteDevice(req.params.deviceId, userId);
            if (result.status === resultStatus_type_1.ResultStatus.Success) {
                res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
            }
            if (result.status === resultStatus_type_1.ResultStatus.NotFound) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
            }
            if (result.status === resultStatus_type_1.ResultStatus.Forbidden) {
                res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send();
            }
            if (result.status === resultStatus_type_1.ResultStatus.Unauthorized) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
            }
        });
    }
    deleteSecurityDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const tokenPayload = this.jwtService.verifyAndDecodeToken(refreshToken);
            if (!tokenPayload) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
                return;
            }
            const result = yield this.devicesService.deleteAllSecurityDevices(tokenPayload.deviceId, tokenPayload.userId);
            result.status === resultStatus_type_1.ResultStatus.Success
                ? res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send()
                : res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
        });
    }
    getSecurityDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const device = this.jwtService.verifyAndDecodeToken(refreshToken);
            if (!device) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
                return;
            }
            const result = yield this.devicesService.getSecurityDevices(device.userId);
            result.status == resultStatus_type_1.ResultStatus.Success
                ? res.status(http_status_codes_1.StatusCodes.OK).send(result.data)
                : res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
        });
    }
};
exports.SecurityDevicesController = SecurityDevicesController;
exports.SecurityDevicesController = SecurityDevicesController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(jwtService_1.JwtService)),
    __param(1, (0, inversify_1.inject)(devicesService_1.DevicesService)),
    __metadata("design:paramtypes", [jwtService_1.JwtService,
        devicesService_1.DevicesService])
], SecurityDevicesController);
