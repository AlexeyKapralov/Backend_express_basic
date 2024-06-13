import { IUserInputModel } from '../models/userInput.model'
import { IUserViewModel } from '../models/userView.model'
import {UsersRepository} from '../repository/users.repository'
import { ResultType } from '../../../common/types/result.type'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import {getUserViewModel} from "../mappers/userMappers";
import {inject, injectable} from "inversify";
import {BcryptService} from "../../../common/adapters/bcrypt.service";

@injectable()
export class UsersService {

		constructor(
			@inject(UsersRepository) protected usersRepository: UsersRepository,
			@inject(BcryptService) protected bcryptService: BcryptService
		) {}

		async createUser(
			data: IUserInputModel
		): Promise<ResultType<IUserViewModel | null>> {
			const passwordHash = await this.bcryptService.createPasswordHash(data.password)
			const user = await this.usersRepository.createUser(data, passwordHash, 'admin')
			return user
				? {
					status: ResultStatus.Success,
					data: getUserViewModel(user)
				}
				: {
					status: ResultStatus.BadRequest,
					data: null
				}
		}
		async deleteUser(id: string ): Promise<ResultType>{

			const user = await this.usersRepository.findUserById(id)
			if (user) {
				return await this.usersRepository.deleteUser(id)
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
