import { Request, Response } from 'express'
import { ICommentViewModel } from '../models/commentView.model'
import { StatusCodes } from 'http-status-codes'
import { commentsQueryRepository } from '../repository/commentsQuery.repository'
import {jwtService} from "../../../common/adapters/jwt.service";
import {usersQueryRepository} from "../../users/repository/usersQuery.repository";

export const getCommentByIdController = async (req: Request<{commentId:string}>, res: Response<ICommentViewModel>) => {


	const token = req.headers.authorization?.split(' ')[1] || null
	const userId = jwtService.getUserIdByToken(token || '')

	let result
	if (userId) {
		result = await usersQueryRepository.findUserById(userId.toString())
	}

	let comment
	if (result) {
		comment = await commentsQueryRepository.getCommentById(req.params.commentId, result!.id)
	} else {
		comment = await commentsQueryRepository.getCommentById(req.params.commentId)
	}

	comment
		? res.status(StatusCodes.OK).send(comment)
		: res.status(StatusCodes.NOT_FOUND).send()

}