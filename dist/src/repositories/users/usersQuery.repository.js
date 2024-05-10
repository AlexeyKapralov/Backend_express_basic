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
exports.usersQueryRepository = void 0;
const db_1 = require("../../db/db");
const mappers_1 = require("../../common/utils/mappers");
exports.usersQueryRepository = {
    findUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = [];
            if (query.searchEmailTerm) {
                conditions.push({ email: { $regex: query.searchEmailTerm, $options: 'i' } });
            }
            if (query.searchLoginTerm) {
                conditions.push({ login: { $regex: query.searchLoginTerm, $options: 'i' } });
            }
            let newQuery = {};
            if (conditions.length > 0) {
                newQuery = { $or: conditions };
            }
            const res = yield db_1.db.getCollection().usersCollection
                .find(newQuery)
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();
            let resNoLimit = yield db_1.db.getCollection().usersCollection
                .find(newQuery)
                .toArray();
            const countDocs = resNoLimit.length;
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: res ? res.map(mappers_1.getUserViewModel) : []
            };
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_1.db.getCollection().usersCollection
                .findOne({ _id: id });
            return res ? (0, mappers_1.getUserViewModel)(res) : undefined;
        });
    },
    findUserByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.getCollection().usersCollection.findOne({ confirmationCode: code });
            return user ? user : undefined;
        });
    },
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollection().usersCollection.findOne({
                $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
            });
            return result !== null ? result : undefined;
        });
    },
    findUserWithPass(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollection().usersCollection.findOne({
                $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
            });
            return result !== null ? result : undefined;
        });
    }
};
