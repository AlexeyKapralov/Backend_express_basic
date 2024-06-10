import {Request, Response} from 'express'
import { IPaginator } from '../../../common/types/paginator'
import { ICommentViewModel } from '../../comments/models/commentView.model'
import { commentsQueryRepository } from '../../comments/repository/commentsQuery.repository'
import { getQueryParams } from '../../../common/utils/mappers'
import { StatusCodes } from 'http-status-codes'
import { IQueryModel } from '../../../common/types/query.model'
import {jwtService} from "../../../common/adapters/jwt.service";
import {usersQueryRepository} from "../../users/repository/usersQuery.repository";

export const getCommentsController = async (req: Request<{id:string}, {},{},IQueryModel>, res: Response<IPaginator<ICommentViewModel>>) => {

	const query = getQueryParams(req.query)

	const token = req.headers.authorization?.split(' ')[1] || null
	const userId = jwtService.getUserIdByToken(token || '')

	let result
	if (userId) {
		result = await usersQueryRepository.findUserById(userId.toString())
	}

	let comments
	if (result) {
		comments = await commentsQueryRepository.getComments(req.params.id, query, userId!)
	} else {
		comments = await commentsQueryRepository.getComments(req.params.id, query)
	}

	comments
		? res.status(StatusCodes.OK).send(comments)
		: res.status(StatusCodes.NOT_FOUND).send()
}