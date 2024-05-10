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
                yield db_1.db.getCollection().usersCollection.updateOne({ _id: user._id }, { $set: { confirmationCode: code,
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
    loginUser(data) {
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
                return {
                    status: isTrueHash ? resultStatus_type_1.ResultStatus.Success : resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
            }
        });
    }
};
