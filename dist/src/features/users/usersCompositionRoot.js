"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const users_service_1 = require("./service/users.service");
const users_repository_1 = require("./repository/users.repository");
const usersRepository = new users_repository_1.UsersRepository();
exports.usersService = new users_service_1.UsersService(usersRepository);
