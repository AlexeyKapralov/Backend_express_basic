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
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const auth_service_1 = require("./service/auth.service");
const http_status_codes_1 = require("http-status-codes");
const resultStatus_type_1 = require("../../common/types/resultStatus.type");
const userMappers_1 = require("../users/mappers/userMappers");
const date_fns_1 = require("date-fns");
const jwtService_1 = require("../../common/adapters/jwtService");
const usersQuery_repository_1 = require("../users/repository/usersQuery.repository");
const generators_1 = require("../../common/utils/generators");
let AuthController = class AuthController {
    constructor(authService, usersQueryRepository, jwtService) {
        this.authService = authService;
        this.usersQueryRepository = usersQueryRepository;
        this.jwtService = jwtService;
    }
    emailResending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.resendConfirmationCode(req.body.email);
            result.status === resultStatus_type_1.ResultStatus.Success ? res.sendStatus(http_status_codes_1.StatusCodes.NO_CONTENT) : res.sendStatus(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    }
    getUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.findUserById(req.userId);
            user ? res.status(http_status_codes_1.StatusCodes.OK).json((0, userMappers_1.getUserInfo)(user)) : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.loginUser(req.body, req.headers['user-agent'] || 'unknown Device Name', req.ip || 'Unknown IP');
            result.status === resultStatus_type_1.ResultStatus.Success
                ? res
                    .cookie('refreshToken', result.data.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    expires: (0, date_fns_1.addSeconds)(new Date(), 20)
                })
                    .status(http_status_codes_1.StatusCodes.OK).json({
                    accessToken: result.data.accessToken
                })
                : res
                    .status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send();
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const tokenPayload = this.jwtService.verifyAndDecodeToken(refreshToken);
            const result = yield this.authService.logout(tokenPayload.deviceId, tokenPayload.userId, tokenPayload.iat);
            if (result.status === resultStatus_type_1.ResultStatus.Success) {
                res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json();
            }
            if (result.status === resultStatus_type_1.ResultStatus.BadRequest) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json();
            }
            if (result.status === resultStatus_type_1.ResultStatus.Unauthorized) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(result.errorMessage);
            }
        });
    }
    newPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPassword = req.body.newPassword;
            const recoveryCode = req.body.recoveryCode;
            const updatedPasswordStatus = yield this.authService.setNewPassword(recoveryCode, newPassword);
            if (updatedPasswordStatus.status === resultStatus_type_1.ResultStatus.Success) {
                res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
                return;
            }
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send();
        });
    }
    passwordRecovery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const user = yield this.usersQueryRepository.findUserByLoginOrEmail(email);
            if (!user) {
                res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json();
                return;
            }
            const recoveryStatus = yield this.authService.recoveryPassword(email);
            switch (recoveryStatus.status) {
                case resultStatus_type_1.ResultStatus.NotFound: // if (x === 'value1')
                    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
                    break;
                case resultStatus_type_1.ResultStatus.BadRequest:
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send();
                    break;
                default:
                    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
                    break;
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const tokenPayload = this.jwtService.verifyAndDecodeToken(refreshToken);
            if (!tokenPayload) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json();
                return;
            }
            const result = yield this.authService.refreshToken(tokenPayload.deviceId, tokenPayload.userId, tokenPayload.iat);
            if (result.status === resultStatus_type_1.ResultStatus.Success) {
                (0, generators_1.setCookie)(res, result.data.refreshToken);
                res.status(http_status_codes_1.StatusCodes.OK)
                    .send({ accessToken: result.data.accessToken });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json();
            }
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.registrationUser(req.body);
            if (result.status === resultStatus_type_1.ResultStatus.Success) {
                res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json();
            }
            if (result.status === resultStatus_type_1.ResultStatus.BadRequest) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json();
            }
        });
    }
    registrationConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.updateUserConfirm(req.body.code);
            result.status === resultStatus_type_1.ResultStatus.Success
                ? res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send()
                : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(auth_service_1.AuthService)),
    __param(1, (0, inversify_1.inject)(usersQuery_repository_1.UsersQueryRepository)),
    __param(2, (0, inversify_1.inject)(jwtService_1.JwtService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        usersQuery_repository_1.UsersQueryRepository,
        jwtService_1.JwtService])
], AuthController);
