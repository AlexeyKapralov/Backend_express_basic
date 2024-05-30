import { Request, Response } from 'express'
import { commentsService } from '../service/comments.service'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import { StatusCodes } from 'http-status-codes'

export const deleteCommentByIdController = async (req: Request<{commentId: string}>, res:Response) => {
	const result = await commentsService.deleteComment(req.userId!, req.params.commentId)

	switch (result.status) {
		case ResultStatus.Success:
			res.status(StatusCodes.NO_CONTENT).json()
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