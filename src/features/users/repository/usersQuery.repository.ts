import {IUserViewModel} from '../models/userView.model'
import {SortDirection} from 'mongodb'
import {IPaginator} from '../../../common/types/paginator'
import {IQueryModel} from '../../../common/types/query.model'
import {getUserViewModel} from "../mappers/userMappers";
import {UsersModel} from "../domain/user.entity";
import {injectable} from "inversify";

@injectable()
export class UsersQueryRepository {
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

		const res = await UsersModel
			.find(newQuery)
			.sort({[query.sortBy!]: query.sortDirection! as SortDirection})
			.skip((query.pageNumber! - 1) * query.pageSize!)
			.limit(query.pageSize!)
			.lean()

		let resNoLimit = await UsersModel
			.find(newQuery)
			.lean()
		const countDocs = resNoLimit.length

		return {
			pagesCount: Math.ceil(countDocs / query.pageSize!),
			page: query.pageNumber!,
			pageSize: query.pageSize!,
			totalCount: countDocs,
			items: res ? res.map(getUserViewModel) : []
		}
	}
	async findUserById(id: string): Promise<IUserViewModel | undefined> {
		const res = await UsersModel
			.findOne({ _id: id })
		return res ? getUserViewModel(res) : undefined
	}
	async findUserByLoginOrEmail(loginOrEmail: string): Promise<IUserViewModel | undefined> {
		const user = await UsersModel.findOne({
				$or: [{ login: loginOrEmail }, { email: loginOrEmail }]
			}
		)
		return user !== null ? getUserViewModel(user) : undefined
	}
}