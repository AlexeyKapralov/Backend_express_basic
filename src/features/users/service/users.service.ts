import { bcryptService } from '../../../common/adapters/bcrypt.service'
import { IUserInputModel } from '../models/userInput.model'
import { IUserViewModel } from '../models/userView.model'
import { usersRepository } from '../repository/users.repository'
import { ResultType } from '../../../common/types/result.type'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import {getUserViewModel} from "../mappers/userMappers";

export const usersService = {
		async createUser(
			data: IUserInputModel
		): Promise<ResultType<IUserViewModel | null>> {
			const passwordHash = await bcryptService.createPasswordHash(data.password)
			const user = await usersRepository.createUser(data, passwordHash, 'admin')
			return user
				? {
					status: ResultStatus.Success,
					data: getUserViewModel(user)
				}
				: {
					status: ResultStatus.BadRequest,
					data: null
				}
		},
		async deleteUser(id: string ): Promise<ResultType>{

			const user = await usersRepository.findUserById(id)
			if (user) {
				return await usersRepository.deleteUser(id)
					? {
						status: ResultStatus.Success,
						data: null
					}
					:{
						status: ResultStatus.BadRequest,
						data: null
					}
			} else {
				return {
					status: ResultStatus.NotFound,
					data: null
				}
			}
		}
}
