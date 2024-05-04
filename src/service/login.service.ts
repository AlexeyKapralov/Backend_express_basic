import { bcryptService } from '../common/adapters/bcrypt.service'
import { usersRepository } from '../repositories/users/users.repository'
import { ILoginInputModel } from '../features/auth/models/loginInput.model'
import { ResultType } from '../common/types/result.type'
import { ResultStatus } from '../common/types/resultStatus.type'

export const loginService = {
	async loginUser(data: ILoginInputModel): Promise<ResultType> {
		const user = await usersRepository.findUserWithPass(data.loginOrEmail)

		if (!user) {
			return {
				data: null,
				status: ResultStatus.NotFound
			}
		} else {
			const isTrueHash = await bcryptService.comparePasswordsHash(data.password, user.password)
			return {
				status: isTrueHash ? ResultStatus.Success : ResultStatus.BadRequest,
				data: null
			}
		}
	}
}
