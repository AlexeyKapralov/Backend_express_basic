import { Request, Response } from 'express'
import { ICommentViewModel } from '../models/commentView.model'
import { StatusCodes } from 'http-status-codes'
import { commentsQueryRepository } from '../repository/commentsQuery.repository'

export const getCommentByIdController = async (req: Request<{commentId:string}>, res: Response<ICommentViewModel>) => {
	const comment = await commentsQueryRepository.getCommentById(req.params.commentId)

	comment
		? res.status(StatusCodes.OK).json(comment)
		: res.status(StatusCodes.NOT_FOUND).json()

}