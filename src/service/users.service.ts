import { bcryptService } from '../common/adapters/bcrypt.service'
import { IUserInputModel } from '../features/users/models/user.input.model'
import {
	IQueryUserModel,
	IUserViewModel
} from '../features/users/models/user.view.model'
import { usersRepository } from '../repositories/users/users.repository'
const bcrypt = require('bcrypt')

export const usersService = {
	async createUser(
		data: IUserInputModel,
		auth: string
	): Promise<IUserViewModel | undefined> {
		const passwordHash = await bcryptService.createPasswordHash(data.password)
		return await usersRepository.createUser(data, passwordHash)
	},
	async getUsers(query: IQueryUserModel) {
		return await usersRepository.findUsers(query)
	}
}
