import {AuthService} from "./service/auth.service";
import {UsersRepository} from "../users/repository/users.repository";
import {DevicesRepository} from "../securityDevices/repository/devices.repository";

const userRepository = new UsersRepository()
const devicesRepository = new DevicesRepository()
export const authService = new AuthService(userRepository, devicesRepository)