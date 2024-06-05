"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const auth_service_1 = require("./service/auth.service");
const users_repository_1 = require("../users/repository/users.repository");
const devices_repository_1 = require("../securityDevices/repository/devices.repository");
const userRepository = new users_repository_1.UsersRepository();
const devicesRepository = new devices_repository_1.DevicesRepository();
exports.authService = new auth_service_1.AuthService(userRepository, devicesRepository);
