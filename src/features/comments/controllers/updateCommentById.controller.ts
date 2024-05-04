import { Request, Response } from 'express'
import { ICommentInputModel } from '../models/commentInput.model'
import { commentsService } from '../../../service/comments.service'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import { StatusCodes } from 'http-status-codes'

export const updateCommentByIdController = async (req: Request<{commentId:string}, {},ICommentInputModel>, res: Response) => {
	const result = await commentsService.updateComment(req.userId!, req.params.commentId, req.body)

	switch (result.status) {
		case ResultStatus.Success:
			res.status(StatusCodes.OK).json(result.data)
			break
		case ResultStatus.NotFound:
			res.status(StatusCodes.NOT_FOUND).json()
			break
		case ResultStatus.Forbidden:
			res.status(StatusCodes.FORBIDDEN).json()
			break
		default:
			res.status(StatusCodes.BAD_REQUEST).json()
	}
}