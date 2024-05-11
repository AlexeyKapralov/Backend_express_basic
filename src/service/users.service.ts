import { bcryptService } from '../common/adapters/bcrypt.service'
import { IUserInputModel } from '../features/users/models/userInput.model'
import { IUserViewModel } from '../features/users/models/userView.model'
import { usersRepository } from '../repositories/users/users.repository'
import { getUserViewModel } from '../common/utils/mappers'
import { ResultType } from '../common/types/result.type'
import { ResultStatus } from '../common/types/resultStatus.type'
import {usersQueryRepository} from "../repositories/users/usersQuery.repository";

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
			const user = await usersQueryRepository.findUserById(id)
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
