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
exports.AuthService = void 0;
const bcrypt_service_1 = require("../../../common/adapters/bcrypt.service");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const email_service_1 = require("../../../common/adapters/email.service");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const settings_1 = require("../../../common/config/settings");
const jwt_service_1 = require("../../../common/adapters/jwt.service");
const user_entity_1 = require("../../users/domain/user.entity");
const devicesCompositionRoot_1 = require("../../securityDevices/devicesCompositionRoot");
class AuthService {
    constructor(usersRepository, devicesRepository) {
        this.usersRepository = usersRepository;
        this.devicesRepository = devicesRepository;
    }
    registrationUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield bcrypt_service_1.bcryptService.createPasswordHash(data.password);
            const user = yield this.usersRepository.createUser(data, passwordHash);
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
                email_service_1.emailService.sendConfirmationCode(email, 'Password recovery', html);
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
            const isNewPassword = bcrypt_service_1.bcryptService.comparePasswordsHash(password, user.password);
            if (!isNewPassword) {
                return {
                    status: resultStatus_type_1.ResultStatus.Forbidden,
                    errorMessage: 'password already used',
                    data: null
                };
            }
            const passwordHash = yield bcrypt_service_1.bcryptService.createPasswordHash(password);
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
            const isTrueHash = yield bcrypt_service_1.bcryptService.comparePasswordsHash(data.password, user.password);
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
            const accessToken = jwt_service_1.jwtService.createAccessToken(user._id);
            const refreshToken = jwt_service_1.jwtService.createRefreshToken(device.deviceId, device.userId);
            const refreshTokenPayload = jwt_service_1.jwtService.verifyAndDecodeToken(refreshToken);
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
            const currentDevice = yield devicesCompositionRoot_1.devicesService.getDevice(deviceId, userId, iat);
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
            const newAccessToken = jwt_service_1.jwtService.createAccessToken(device.userId);
            const newRefreshToken = jwt_service_1.jwtService.createRefreshToken(device.deviceId, device.userId);
            const newPayload = jwt_service_1.jwtService.verifyAndDecodeToken(newRefreshToken);
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
}
exports.AuthService = AuthService;
