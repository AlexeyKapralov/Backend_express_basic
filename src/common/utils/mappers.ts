import { IUserDBModel } from '../../features/users/models/user.db.model'
import { IUserViewModel } from '../../features/users/models/user.view.model'

export const getUserViewModel = (data: IUserDBModel): IUserViewModel => {
	return {
		id: data._id,
		login: data.login,
		email: data.email,
		createdAt: data.createdAt,
		password: data.password
	}
}
