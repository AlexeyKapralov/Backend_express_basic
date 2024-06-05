"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const auth_service_1 = require("./auth.service");
const users_repository_1 = require("../../users/repository/users.repository");
const userRepository = new users_repository_1.UsersRepository();
exports.authService = new auth_service_1.AuthService(userRepository);
