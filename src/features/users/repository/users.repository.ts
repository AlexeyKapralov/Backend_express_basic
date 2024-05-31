import { ObjectId } from 'mongodb'
import { IUserInputModel } from '../models/userInput.model'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { SETTINGS } from '../../../common/config/settings'
import {UsersModel} from "../domain/user.dto";
import {IUserDbModel} from "../models/userDb.model";

export const usersRepository = {
	async findUserWithPass(loginOrEmail: string): Promise<IUserDbModel | undefined> {
		const result = await UsersModel.findOne({
				$or: [{ login: loginOrEmail }, { email: loginOrEmail }]
			}
		)
		return result !== null ? result : undefined
	},
	async findUserByLoginOrEmail(loginOrEmail: string): Promise<IUserDbModel | undefined> {
		const result = await UsersModel.findOne({
				$or: [{ login: loginOrEmail }, { email: loginOrEmail }]
			}
		)
		return result !== null ? result : undefined
	},
	async findUserById(id: string): Promise<IUserDbModel | undefined> {
		const res = await UsersModel
			.findOne({ _id: id })
		return res ? res : undefined
	},
	async createUser(data: IUserInputModel, hash: string, admin: 'admin' | 'noAdmin' = 'noAdmin') {
		const user: IUserDbModel = {
			_id: new ObjectId().toString(),
			login: data.login,
			email: data.email,
			createdAt: new Date().toISOString(),
			password: hash,
			confirmationCode: uuidv4(),
			confirmationCodeExpired: add(new Date(), SETTINGS.EXPIRED_LIFE),
			isConfirmed: admin === 'admin'
		}
		const createdUser = await UsersModel.create(user)

		return createdUser ? user : undefined
	},
	async deleteUser(id: string) {
		const result = await UsersModel.deleteOne({
			_id: id
		})
		return result.deletedCount > 0
	},
	async updateUserConfirm(
		code: string,
		isConfirmed: boolean = true
	) {
    const result =
				await UsersModel.updateOne({ confirmationCode: code }, {$set: { isConfirmed: isConfirmed }})
    return result.matchedCount > 0
	}
}
