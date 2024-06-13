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
exports.UsersQueryRepository = void 0;
const userMappers_1 = require("../mappers/userMappers");
const user_entity_1 = require("../domain/user.entity");
const inversify_1 = require("inversify");
let UsersQueryRepository = class UsersQueryRepository {
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
            const res = yield user_entity_1.UsersModel
                .find(newQuery)
                .sort({ [query.sortBy]: query.sortDirection })
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .lean();
            let resNoLimit = yield user_entity_1.UsersModel
                .find(newQuery)
                .lean();
            const countDocs = resNoLimit.length;
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: res ? res.map(userMappers_1.getUserViewModel) : []
            };
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield user_entity_1.UsersModel
                .findOne({ _id: id });
            return res ? (0, userMappers_1.getUserViewModel)(res) : undefined;
        });
    }
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_entity_1.UsersModel.findOne({
                $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
            });
            return user !== null ? (0, userMappers_1.getUserViewModel)(user) : undefined;
        });
    }
};
exports.UsersQueryRepository = UsersQueryRepository;
exports.UsersQueryRepository = UsersQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersQueryRepository);
