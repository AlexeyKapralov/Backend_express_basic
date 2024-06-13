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
exports.UsersService = void 0;
const users_repository_1 = require("../repository/users.repository");
const resultStatus_type_1 = require("../../../common/types/resultStatus.type");
const userMappers_1 = require("../mappers/userMappers");
const inversify_1 = require("inversify");
const bcrypt_service_1 = require("../../../common/adapters/bcrypt.service");
let UsersService = class UsersService {
    constructor(usersRepository, bcryptService) {
        this.usersRepository = usersRepository;
        this.bcryptService = bcryptService;
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield this.bcryptService.createPasswordHash(data.password);
            const user = yield this.usersRepository.createUser(data, passwordHash, 'admin');
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
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserById(id);
            if (user) {
                return (yield this.usersRepository.deleteUser(id))
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
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(users_repository_1.UsersRepository)),
    __param(1, (0, inversify_1.inject)(bcrypt_service_1.BcryptService)),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        bcrypt_service_1.BcryptService])
], UsersService);
