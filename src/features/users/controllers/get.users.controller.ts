import { Request, Response } from 'express'
import { usersService } from '../../../service/users.service'
import { IQueryUserModel } from '../models/user.view.model'

export const getUsersController = async (
	req: Request<{}, {}, {}, IQueryUserModel>,
	res: Response{}
) => {
	await usersService.getUsers(req.query)
}
