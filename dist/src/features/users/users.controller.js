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
exports.UsersController = void 0;
const inversify_1 = require("inversify");
const resultStatus_type_1 = require("../../common/types/resultStatus.type");
const http_status_codes_1 = require("http-status-codes");
const users_service_1 = require("./service/users.service");
const mappers_1 = require("../../common/utils/mappers");
const usersQuery_repository_1 = require("./repository/usersQuery.repository");
let UsersController = class UsersController {
    constructor(usersService, usersQueryRepository) {
        this.usersService = usersService;
        this.usersQueryRepository = usersQueryRepository;
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersService.createUser(req.body);
            result.status === resultStatus_type_1.ResultStatus.Success
                ? res.status(http_status_codes_1.StatusCodes.CREATED).send(result.data)
                : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json();
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield this.usersService.deleteUser(id);
            return result.status === resultStatus_type_1.ResultStatus.Success ? res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send() : res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send();
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, mappers_1.getQueryParams)(req.query);
            const result = yield this.usersQueryRepository.findUsers(query);
            res.status(http_status_codes_1.StatusCodes.OK).send(result);
        });
    }
};
exports.UsersController = UsersController;
exports.UsersController = UsersController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(users_service_1.UsersService)),
    __param(1, (0, inversify_1.inject)(usersQuery_repository_1.UsersQueryRepository)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        usersQuery_repository_1.UsersQueryRepository])
], UsersController);
