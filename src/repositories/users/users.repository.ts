import { ObjectId } from 'mongodb'
import { IUserDbModel } from '../../features/users/models/userDb.model'
import { IUserInputModel } from '../../features/users/models/userInput.model'
import { db } from '../../db/db'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'

export const usersRepository = {
	async createUser(data: IUserInputModel, hash: string) {
		const user: IUserDbModel = {
			_id: new ObjectId().toString(),
			login: data.login,
			email: data.email,
			createdAt: new Date().toISOString(),
			password: hash,
			confirmationCode: uuidv4(),
			confirmationCodeExpired: add(new Date(), { hours: 1 }),
			isConfirmed: false
		}
		const result = await db.getCollection().usersCollection.insertOne(user)

		return result ? user : undefined
	},

	async updateUserConfirm(
		code: string,
		isConfirmed: boolean = true
	) {
    const result =
				await db.getCollection().usersCollection.updateOne({ confirmationCode: code }, {$set: { isConfirmed: isConfirmed }})
    return result.matchedCount > 0
	},

	//todo переместить все find в query репозиторий
	async findUserByLoginOrEmail(loginOrEmail: string): Promise<IUserDbModel | undefined> {
		const result = await db.getCollection().usersCollection.findOne({
				$or: [{ login: loginOrEmail }, { email: loginOrEmail }]
			}
		)
		return result !== null ? result : undefined
	},
	async findUserWithPass(loginOrEmail: string): Promise<IUserDbModel | undefined> {
		const result = await db.getCollection().usersCollection.findOne({
				$or: [{ login: loginOrEmail }, { email: loginOrEmail }]
			}
		)
		return result !== null ? result : undefined
	},
	async deleteUser(id: string) {
		const result = await db.getCollection().usersCollection.deleteOne({
			_id: id
		})
		return result.deletedCount > 0
	}
}
