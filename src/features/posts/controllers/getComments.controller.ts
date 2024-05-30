import {Request, Response} from 'express'
import { IPaginator } from '../../../common/types/paginator'
import { ICommentViewModel } from '../../comments/models/commentView.model'
import { commentsQueryRepository } from '../../comments/repository/commentsQuery.repository'
import { getQueryParams } from '../../../common/utils/mappers'
import { StatusCodes } from 'http-status-codes'
import { IQueryModel } from '../../../common/types/query.model'

export const getCommentsController = async (req: Request<{id:string}, {},{},IQueryModel>, res: Response<IPaginator<ICommentViewModel>>) => {
	const query = getQueryParams(req.query)
	const result = await commentsQueryRepository.getComments(req.params.id, query)

	result
		? res.status(StatusCodes.OK).json(result)
		: res.status(StatusCodes.NOT_FOUND).json()
}