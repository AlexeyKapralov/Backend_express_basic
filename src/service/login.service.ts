import {bcryptService} from '../common/adapters/bcrypt.service'
import {usersRepository} from '../repositories/users/users.repository'
import {ILoginInputModel} from "../features/auth/models/loginInputModel";

export const loginService = {
    async loginUser(data: ILoginInputModel) {
        const user = await usersRepository.findUserWithPass(data.loginOrEmail)

        if (!user) {
            return false
        } else {
            return bcryptService.comparePasswordsHash(data.password, user.password)
        }
    }
}
