import {UsersService} from "./service/users.service";
import {UsersRepository} from "./repository/users.repository";

const usersRepository = new UsersRepository();
export const usersService = new UsersService(usersRepository)