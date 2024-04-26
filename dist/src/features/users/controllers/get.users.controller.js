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
exports.getUsersController = void 0;
const users_service_1 = require("../../../service/users.service");
const getUsersController = (req_1, res_1, _a) => __awaiter(void 0, [req_1, res_1, _a], void 0, function* (req, res, {}) {
    yield users_service_1.usersService.getUsers(req.query);
});
exports.getUsersController = getUsersController;
