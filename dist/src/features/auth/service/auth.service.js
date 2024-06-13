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
exports.AuthService = void 0;
const users_repository_1 = require("../../users/repository/users.repository");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const settings_1 = require("../../../common/config/settings");
const user_entity_1 = require("../../users/domain/user.entity");
const devices_repository_1 = require("../../securityDevices/repository/devices.repository");
const inversify_1 = require("inversify");
const email_service_1 = require("../../../common/adapters/email.service");
const bcrypt_service_1 = require("../../../common/adapters/bcrypt.service");
const jwtService_1 = require("../../../common/adapters/jwtService");
const devicesService_1 = require("../../securityDevices/service/devicesService");
let AuthService = class AuthService {
    constructor(usersRepository, devicesRepository, emailService, bcryptService, jwtService, devicesService) {
        this.usersRepository = usersRepository;
        this.devicesRepository = devicesRepository;
        this.emailService = emailService;
        this.bcryptService = bcryptService;
        this.jwtService = jwtService;
        this.devicesService = devicesService;
    }
    registrationUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield this.bcryptService.createPasswordHash(data.password);
            const user = yield this.usersRepository.createUser(data, passwordHash);
            if (user) {
                const html = `
				 <h1>Thank you for registration</h1>
				 <p>To finish registration please follow the link below:
						 <a href='https://ab.com?code=${user.confirmationCode}'>complete registration</a>
				 </p>
			`;
                try {
                    this.emailService.sendConfirmationCode(data.email, 'Confirmation code', html);
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
    }
    updateUserConfirm(confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usersRepository.updateUserConfirm(confirmationCode);
            return {
                status: resultStatus_type_1.ResultStatus.Success,
                data: null
            };
        });
    }
    resendConfirmationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByLoginOrEmail(email);
            if (user) {
                const code = (0, uuid_1.v4)();
                const confirmationCodeExpiredNew = (0, date_fns_1.add)(new Date(), settings_1.SETTINGS.EXPIRED_LIFE);
                yield user_entity_1.UsersModel.updateOne({ _id: user._id }, {
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
                    this.emailService.sendConfirmationCode(user.email, 'Confirmation code', html);
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
    }
    recoveryPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByLoginOrEmail(email);
            if (!user) {
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
            }
            const confirmationCode = (0, uuid_1.v4)();
            const confirmationCodeExpired = (0, date_fns_1.add)(new Date(), settings_1.SETTINGS.EXPIRED_LIFE);
            const isUnconfirmed = yield this.usersRepository.setUnconfirmed(user._id, confirmationCode, confirmationCodeExpired);
            if (!isUnconfirmed) {
                return {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
            }
            const html = `
            <h1>Password recovery</h1>
           <p>To finish password recovery please follow the link below:
              <a href='https://somesite.com/password-recovery?recoveryCode=${confirmationCode}'>recovery password</a>
          </p>
        `;
            try {
                this.emailService.sendConfirmationCode(email, 'Password recovery', html);
            }
            catch (e) {
                console.error(`some problems with send confirm code ${e}`);
            }
            return {
                status: resultStatus_type_1.ResultStatus.Success,
                data: null
            };
        });
    }
    setNewPassword(recoveryCode, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByRecoveryCode(recoveryCode);
            if (!user || user.confirmationCodeExpired < new Date()) {
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
            }
            const isNewPassword = this.bcryptService.comparePasswordsHash(password, user.password);
            if (!isNewPassword) {
                return {
                    status: resultStatus_type_1.ResultStatus.Forbidden,
                    errorMessage: 'password already used',
                    data: null
                };
            }
            const passwordHash = yield this.bcryptService.createPasswordHash(password);
            const isUpdatePassword = yield this.usersRepository.updatePassword(user._id, passwordHash);
            if (!isUpdatePassword) {
                return {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
            }
            return {
                status: resultStatus_type_1.ResultStatus.Success,
                data: null
            };
        });
    }
    loginUser(data, deviceName, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserWithPass(data.loginOrEmail);
            if (!user) {
                return {
                    data: null,
                    status: resultStatus_type_1.ResultStatus.NotFound
                };
            }
            const isTrueHash = yield this.bcryptService.comparePasswordsHash(data.password, user.password);
            if (!isTrueHash) {
                return {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
            }
            const deviceId = yield this.devicesRepository.findDeviceId(user._id, ip, deviceName);
            const device = {
                userId: user._id,
                deviceId: deviceId === null ? (0, uuid_1.v4)() : deviceId,
                deviceName: deviceName,
                ip: ip
            };
            const accessToken = this.jwtService.createAccessToken(user._id);
            const refreshToken = this.jwtService.createRefreshToken(device.deviceId, device.userId);
            const refreshTokenPayload = this.jwtService.verifyAndDecodeToken(refreshToken);
            if (!refreshTokenPayload) {
                return {
                    status: resultStatus_type_1.ResultStatus.Unauthorized,
                    data: null
                };
            }
            const fullDevice = {
                userId: device.userId,
                deviceId: device.deviceId,
                deviceName: device.deviceName,
                ip: device.ip,
                exp: refreshTokenPayload.exp,
                iat: refreshTokenPayload.iat
            };
            if (yield this.devicesRepository.createOrUpdateDevice(fullDevice)) {
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
        });
    }
    logout(deviceId, userId, iat) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDevice = yield this.devicesService.getDevice(deviceId, userId, iat);
            if (currentDevice.status === resultStatus_type_1.ResultStatus.NotFound) {
                return {
                    status: resultStatus_type_1.ResultStatus.Unauthorized,
                    errorMessage: 'invalid data',
                    data: null
                };
            }
            const isDeleted = yield this.devicesRepository.deleteDeviceById(deviceId);
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
    }
    refreshToken(deviceId, userId, iat) {
        return __awaiter(this, void 0, void 0, function* () {
            let device = yield this.devicesRepository.findDevice(deviceId, userId, iat);
            if (!device || String(iat) !== device.iat) {
                return {
                    status: resultStatus_type_1.ResultStatus.Unauthorized,
                    data: null
                };
            }
            const newAccessToken = this.jwtService.createAccessToken(device.userId);
            const newRefreshToken = this.jwtService.createRefreshToken(device.deviceId, device.userId);
            const newPayload = this.jwtService.verifyAndDecodeToken(newRefreshToken);
            const fullDevice = {
                userId: device.userId,
                deviceId: device.deviceId,
                deviceName: device.deviceName,
                ip: device.ip,
                exp: newPayload.exp,
                iat: newPayload.iat
            };
            const isUpdatedDevice = yield this.devicesRepository.createOrUpdateDevice(fullDevice);
            if (isUpdatedDevice) {
                return {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: { accessToken: newAccessToken, refreshToken: newRefreshToken }
                };
            }
            else {
                return {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(users_repository_1.UsersRepository)),
    __param(1, (0, inversify_1.inject)(devices_repository_1.DevicesRepository)),
    __param(2, (0, inversify_1.inject)(email_service_1.EmailService)),
    __param(3, (0, inversify_1.inject)(bcrypt_service_1.BcryptService)),
    __param(4, (0, inversify_1.inject)(jwtService_1.JwtService)),
    __param(5, (0, inversify_1.inject)(devicesService_1.DevicesService)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        devices_repository_1.DevicesRepository,
        email_service_1.EmailService,
        bcrypt_service_1.BcryptService,
        jwtService_1.JwtService,
        devicesService_1.DevicesService])
], AuthService);
