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
exports.usersRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../db/db");
const mappers_1 = require("../../common/utils/mappers");
exports.usersRepository = {
    createUser(data, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = {
                _id: new mongodb_1.ObjectId().toString(),
                login: data.login,
                email: data.email,
                createdAt: new Date().toISOString(),
                password: hash
            };
            const result = yield db_1.db.getCollection().usersCollection.insertOne(user);
            return result ? (0, mappers_1.getUserViewModel)(user) : undefined;
        });
    },
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollection().usersCollection.findOne({
                $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
            });
            //TODO: return сработал только после того как я резалт сделал явным типом as
            return result !== null ? (0, mappers_1.getUserViewModel)(result) : undefined;
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollection().usersCollection.deleteOne({
                _id: id
            });
            return result.deletedCount > 0;
        });
    }
};
