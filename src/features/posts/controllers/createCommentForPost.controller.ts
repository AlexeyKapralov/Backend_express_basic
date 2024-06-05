import { Request, Response } from 'express'
import { ICommentInputModel } from '../../comments/models/commentInput.model'
import { ICommentViewModel } from '../../comments/models/commentView.model'
import { ResultStatus } from '../../../common/types/resultStatus.type'
import { StatusCodes } from 'http-status-codes'
import {postsService} from "../postsCompositionRoot";

export const createCommentForPost = async (req: Request<{
	postId: string
}, {}, ICommentInputModel>, res: Response<ICommentViewModel>) => {
	const result = await postsService.createComment(req.userId!, req.params.postId, req.body)

	result.status === ResultStatus.Success
		? res.status(StatusCodes.CREATED).json(result.data!)
		: res.status(StatusCodes.NOT_FOUND).json()
}