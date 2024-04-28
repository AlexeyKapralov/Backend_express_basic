import {IPaginatorUserViewModel} from "../../features/users/models/userView.model";
import {db} from "../../db/db";
import {SortDirection} from "mongodb";
import {getUserViewModel} from "../../common/utils/mappers";
import {IUserQueryModel} from "../../features/users/models/userInput.model";

export const usersQueryRepository = {
    async findUsers(query: IUserQueryModel): Promise<IPaginatorUserViewModel | undefined> {

        // TODO: так правильно делать?
        const conditions = []
        if (query.searchEmailTerm) {
            conditions.push(
                {email: {$regex: query.searchEmailTerm, $options: 'i'}}
            )
        }
        if (query.searchLoginTerm) {
            conditions.push(
                {login: {$regex: query.searchLoginTerm, $options: 'i'}}
            )
        }
        let newQuery = {}
        if (conditions.length > 0) {
            newQuery = { $or: conditions}
        }


        const res = await db.getCollection().usersCollection
            .find(newQuery)
            .sort(query.sortBy, query.sortDirection as SortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const countDocs = await await db.getCollection().usersCollection
            .countDocuments()

        if (res.length !== 0) {
            return {
                pagesCount: Math.ceil(countDocs / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: countDocs,
                items: res.map(getUserViewModel)
            }
        } else {
            return undefined
        }
    }
}