import {ObjectId} from 'mongodb'
import {IUserDbModel} from '../../features/users/models/userDb.model'
import {IUserInputModel} from '../../features/users/models/userInput.model'
import {db} from '../../db/db'
import {getUserViewModel} from '../../common/utils/mappers'
import {IUserViewModel} from '../../features/users/models/userView.model'

export const usersRepository = {
    async createUser(data: IUserInputModel, hash: string) {
        const user: IUserDbModel = {
            _id: new ObjectId().toString(),
            login: data.login,
            email: data.email,
            createdAt: new Date().toISOString(),
            password: hash
        }
        const result = await db.getCollection().usersCollection.insertOne(user)

        return result ? getUserViewModel(user) : undefined
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<IUserViewModel | undefined> {
        const result = await db.getCollection().usersCollection.findOne({
                $or: [{login: loginOrEmail}, {email: loginOrEmail}]
            }
        )
        //TODO: return сработал только после того как я резалт сделал явным типом as
        return result !== null ? getUserViewModel(result as IUserDbModel) : undefined
    },
    async findUserWithPass(loginOrEmail: string): Promise<IUserDbModel | undefined> {
        const result = await db.getCollection().usersCollection.findOne({
                $or: [{login: loginOrEmail}, {email: loginOrEmail}]
            }
        )
        //TODO: return сработал только после того как я резалт сделал явным типом as
        return result !== null ? result as IUserDbModel : undefined
    },
    async deleteUser(id: string) {
        const result = await db.getCollection().usersCollection.deleteOne({
            _id: id
        })
        return result.deletedCount > 0
    }
}
