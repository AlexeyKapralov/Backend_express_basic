import { IUserViewModel } from '../../features/users/models/userView.model'
import { db } from '../../db/db'
import { SortDirection } from 'mongodb'
import { getUserViewModel } from '../../common/utils/mappers'
import { IPaginator } from '../../common/types/paginator'
import { IQueryModel } from '../../common/types/query.model'
import { IUserDbModel } from '../../features/users/models/userDb.model'

export const usersQueryRepository = {
	async findUsers(query: IQueryModel): Promise<IPaginator<IUserViewModel>> {

		const conditions = []
		if (query.searchEmailTerm) {
			conditions.push(
				{ email: { $regex: query.searchEmailTerm, $options: 'i' } }
			)
		}
		if (query.searchLoginTerm) {
			conditions.push(
				{ login: { $regex: query.searchLoginTerm, $options: 'i' } }
			)
		}
		let newQuery = {}
		if (conditions.length > 0) {
			newQuery = { $or: conditions }
		}

		const res = await db.getCollection().usersCollection
			.find(newQuery)
			.sort(query.sortBy!, query.sortDirection as SortDirection)
			.skip((query.pageNumber! - 1) * query.pageSize!)
			.limit(query.pageSize!)
			.toArray()

		let resNoLimit = await db.getCollection().usersCollection
			.find(newQuery)
			.toArray()
		const countDocs = resNoLimit.length

		return {
			pagesCount: Math.ceil(countDocs / query.pageSize!),
			page: query.pageNumber!,
			pageSize: query.pageSize!,
			totalCount: countDocs,
			items: res ? res.map(getUserViewModel) : []
		}
	},
	async findUserById(id: string): Promise<IUserViewModel | undefined> {
		const res = await db.getCollection().usersCollection
			.findOne({ _id: id })
		return res ? getUserViewModel(res) : undefined
	},
	async findUserByConfirmationCode(code: string): Promise<IUserDbModel | undefined> {
		const user = await db.getCollection().usersCollection.findOne(
			{ confirmationCode: code }
		)
		return user ? user : undefined
	},
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
	}
}