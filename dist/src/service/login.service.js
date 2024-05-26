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
exports.loginService = void 0;
const bcrypt_service_1 = require("../common/adapters/bcrypt.service");
const users_repository_1 = require("../repositories/users/users.repository");
const resultStatus_type_1 = require("../common/types/resultStatus.type");
const email_service_1 = require("../common/adapters/email.service");
const db_1 = require("../db/db");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const settings_1 = require("../common/config/settings");
const jwt_service_1 = require("../common/adapters/jwt.service");
const devices_repository_1 = require("../repositories/devices/devices.repository");
const devicesService_1 = require("./devicesService");
exports.loginService = {
    registrationUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield bcrypt_service_1.bcryptService.createPasswordHash(data.password);
            const user = yield users_repository_1.usersRepository.createUser(data, passwordHash);
            if (user) {
                const html = `
				 <h1>Thank you for registration</h1>
				 <p>To finish registration please follow the link below:
						 <a href='https://ab.com?code=${user.confirmationCode}'>complete registration</a>
				 </p>
			`;
                try {
                    email_service_1.emailService.sendConfirmationCode(data.email, 'Confirmation code', html);
                }
                catch (e) {
                    console.error(`some problems with send confirm code ${e}`);
                }
                return {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: null
                };
            }
            else {
                return {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
            }
        });
    },
    confirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            yield users_repository_1.usersRepository.updateUserConfirm(code);
            return {
                status: resultStatus_type_1.ResultStatus.Success,
                data: null
            };
        });
    },
    resendConfirmationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findUserByLoginOrEmail(email);
            if (user) {
                const code = (0, uuid_1.v4)();
                const confirmationCodeExpiredNew = (0, date_fns_1.add)(new Date(), settings_1.SETTINGS.EXPIRED_LIFE);
                yield db_1.db.getCollection().usersCollection.updateOne({ _id: user._id }, {
                    $set: {
                        confirmationCode: code,
                        confirmationCodeExpired: confirmationCodeExpiredNew
                    }
                });
                const html = `
				 <h1>Thank you for registration</h1>
				 <p>To finish registration please follow the link below:
						 <a href='https://ab.com?code=${code}'>complete registration</a>
				 </p>
			`;
                try {
                    email_service_1.emailService.sendConfirmationCode(user.email, 'Confirmation code', html);
                }
                catch (e) {
                    console.error(`some problems with send confirm code ${e}`);
                }
                return {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: null
                };
            }
            else
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
        });
    },
    loginUser(data, deviceName, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findUserWithPass(data.loginOrEmail);
            if (!user) {
                return {
                    data: null,
                    status: resultStatus_type_1.ResultStatus.NotFound
                };
            }
            else {
                const isTrueHash = yield bcrypt_service_1.bcryptService.comparePasswordsHash(data.password, user.password);
                const deviceId = yield devices_repository_1.devicesRepository.findDeviceId(user._id, ip, deviceName);
                const device = {
                    userId: user._id,
                    deviceId: deviceId === null ? (0, uuid_1.v4)() : deviceId,
                    deviceName: deviceName,
                    ip: ip
                };
                const accessToken = jwt_service_1.jwtService.createAccessToken(user._id);
                const refreshToken = jwt_service_1.jwtService.createRefreshToken(device);
                if (isTrueHash) {
                    const refreshTokenPayload = jwt_service_1.jwtService.getPayloadFromRefreshToken(refreshToken);
                    if (yield devices_repository_1.devicesRepository.createOrUpdateDevice(refreshTokenPayload)) {
                        return {
                            status: resultStatus_type_1.ResultStatus.Success,
                            data: { accessToken, refreshToken }
                        };
                    }
                    else {
                        return {
                            status: resultStatus_type_1.ResultStatus.BadRequest,
                            data: null
                        };
                    }
                }
                else {
                    return {
                        status: resultStatus_type_1.ResultStatus.BadRequest,
                        data: null
                    };
                }
            }
        });
    },
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceData = jwt_service_1.jwtService.getPayloadFromRefreshToken(refreshToken);
            if (!deviceData) {
                return {
                    status: resultStatus_type_1.ResultStatus.Unauthorized,
                    errorMessage: 'invalid refresh token',
                    data: null
                };
            }
            const currentDevice = yield devicesService_1.devicesService.getDevice(deviceData);
            if (!deviceData || currentDevice.status === resultStatus_type_1.ResultStatus.NotFound) {
                return {
                    status: resultStatus_type_1.ResultStatus.Unauthorized,
                    errorMessage: 'invalid refresh token',
                    data: null
                };
            }
            const isDeleted = yield devices_repository_1.devicesRepository.deleteDeviceById(deviceData.deviceId);
            return isDeleted
                ? {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: null
                }
                : {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
        });
    },
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceInfo = jwt_service_1.jwtService.getPayloadFromRefreshToken(refreshToken);
            if (!deviceInfo) {
                return {
                    status: resultStatus_type_1.ResultStatus.Unauthorized,
                    data: null
                };
            }
            let device = yield devices_repository_1.devicesRepository.findDevice(deviceInfo);
            if (!device) {
                return {
                    status: resultStatus_type_1.ResultStatus.Unauthorized,
                    data: null
                };
            }
            if (deviceInfo) {
                device = yield db_1.db.getCollection().devices.findOne({
                    deviceId: deviceInfo.deviceId,
                    ip: deviceInfo.ip,
                    iat: deviceInfo.iat,
                    expirationDate: deviceInfo.expirationDate,
                    userId: deviceInfo.userId
                });
            }
            if (device) {
                const newAccessToken = jwt_service_1.jwtService.createAccessToken(device.userId);
                const newRefreshToken = jwt_service_1.jwtService.createRefreshToken({
                    userId: device.userId,
                    deviceName: device.deviceName,
                    deviceId: device.deviceId,
                    ip: device.ip
                });
                const newDevice = jwt_service_1.jwtService.getPayloadFromRefreshToken(newRefreshToken);
                yield devices_repository_1.devicesRepository.createOrUpdateDevice(newDevice);
                return {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: { accessToken: newAccessToken, refreshToken: newRefreshToken }
                };
            }
            return {
                status: resultStatus_type_1.ResultStatus.Unauthorized,
                data: null
            };
        });
    }
};
