import { bcryptService } from '../common/adapters/bcrypt.service'
import { ILoginInputModel } from '../features/users/models/login.input.model'
import { usersRepository } from '../repositories/users/users.repository'

export const loginService = {
	async loginUser(data: ILoginInputModel) {
		const user = await usersRepository.findUserByLoginOrEmail(data.loginOrEmail)

		if (!user) {
			return false
		} else {
			return bcryptService.comparePasswordsHash(data.password, user.password)
		}
	}
}
