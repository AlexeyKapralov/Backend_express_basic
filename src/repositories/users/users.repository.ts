import { ObjectId } from 'mongodb'
import { IUserDBModel } from '../../features/users/models/user.db.model'
import { IUserInputModel } from '../../features/users/models/user.input.model'
import { db } from '../../db/db'
import { getUserViewModel } from '../../common/utils/mappers'
import { IQueryUserModel } from '../../features/users/models/user.view.model'

export const usersRepository = {
	async createUser(data: IUserInputModel, hash: string) {
		const user: IUserDBModel = {
			_id: new ObjectId().toString(),
			login: data.login,
			email: data.email,
			createdAt: new Date().toISOString(),
			password: hash
		}
		const result = await db.getCollection().usersCollection.insertOne(user)

		return result ? getUserViewModel(user) : undefined
	},
	async findUserByLoginOrEmail(loginOrEmail: string) {
		const result = await db
			.getCollection()
			// .usersCollection.findOne({ login: login })
			.usersCollection.findOne({
				$or: [{ login: loginOrEmail }, { email: loginOrEmail }]
			})
		return result !== null ? getUserViewModel(result) : undefined
	},
	async findUsers(query: IQueryUserModel) {}
}
