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
exports.usersService = void 0;
const bcrypt_service_1 = require("../../../common/adapters/bcrypt.service");
const users_repository_1 = require("../repository/users.repository");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const userMappers_1 = require("../mappers/userMappers");
exports.usersService = {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield bcrypt_service_1.bcryptService.createPasswordHash(data.password);
            const user = yield users_repository_1.usersRepository.createUser(data, passwordHash, 'admin');
            return user
                ? {
                    status: resultStatus_type_1.ResultStatus.Success,
                    data: (0, userMappers_1.getUserViewModel)(user)
                }
                : {
                    status: resultStatus_type_1.ResultStatus.BadRequest,
                    data: null
                };
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.findUserById(id);
            if (user) {
                return (yield users_repository_1.usersRepository.deleteUser(id))
                    ? {
                        status: resultStatus_type_1.ResultStatus.Success,
                        data: null
                    }
                    : {
                        status: resultStatus_type_1.ResultStatus.BadRequest,
                        data: null
                    };
            }
            else {
                return {
                    status: resultStatus_type_1.ResultStatus.NotFound,
                    data: null
                };
            }
        });
    }
};
