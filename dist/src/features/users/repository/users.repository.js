"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UsersRepository = void 0;
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
const settings_1 = require("../../../common/config/settings");
const user_entity_1 = require("../domain/user.entity");
const inversify_1 = require("inversify");
let UsersRepository = class UsersRepository {
    findUserWithPass(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_entity_1.UsersModel.findOne({
                $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
            });
            return result !== null ? result : undefined;
        });
    }
    findUserByRecoveryCode(recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_entity_1.UsersModel.findOne({
                confirmationCode: recoveryCode
            });
            return user !== null ? user : undefined;
        });
    }
    updatePassword(userId, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield user_entity_1.UsersModel.updateOne({ _id: userId }, { $set: { password: passwordHash } });
            return updatedUser.modifiedCount > 0;
        });
    }
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_entity_1.UsersModel.findOne({
                $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
            });
            return result !== null ? result : undefined;
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield user_entity_1.UsersModel
                .findOne({ _id: id });
            return res ? res : undefined;
        });
    }
    createUser(data_1, hash_1) {
        return __awaiter(this, arguments, void 0, function* (data, hash, admin = 'noAdmin') {
            const user = {
                _id: new mongodb_1.ObjectId().toString(),
                login: data.login,
                email: data.email,
                createdAt: new Date().toISOString(),
                password: hash,
                confirmationCode: (0, uuid_1.v4)(),
                confirmationCodeExpired: (0, date_fns_1.add)(new Date(), settings_1.SETTINGS.EXPIRED_LIFE),
                isConfirmed: admin === 'admin'
            };
            const createdUser = yield user_entity_1.UsersModel.create(user);
            return createdUser ? user : undefined;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_entity_1.UsersModel.deleteOne({
                _id: id
            });
            return result.deletedCount > 0;
        });
    }
    updateUserConfirm(code_1) {
        return __awaiter(this, arguments, void 0, function* (code, isConfirmed = true) {
            const result = yield user_entity_1.UsersModel.updateOne({ confirmationCode: code }, { $set: { isConfirmed: isConfirmed } });
            return result.matchedCount > 0;
        });
    }
    setUnconfirmed(userId, confirmationCode, confirmationCodeExpired) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield user_entity_1.UsersModel.updateOne({ _id: userId }, {
                $set: {
                    confirmationCodeExpired,
                    confirmationCode,
                    isConfirmed: false
                }
            }).exec();
            return updateResult.modifiedCount > 0;
        });
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersRepository);
