import { Request, Response } from 'express'
import { commentsService } from '../../../service/comments.service'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import { StatusCodes } from 'http-status-codes'

export const deleteCommentByIdController = async (req: Request<{commentId: string}>, res:Response) => {
	const result = await commentsService.deleteComment(req.userId!, req.params.commentId)

	result.status === ResultStatus.Success
		? res.status(StatusCodes.OK).json()
		: res.status(StatusCodes.NOT_FOUND).json()
}