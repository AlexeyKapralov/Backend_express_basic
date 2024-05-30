import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IBlogInputModel } from '../models/blogInput.model'
import { blogsService } from '../sevice/blogs.service'
import { ResultStatus } from '../../../common/types/resultStatus.type'

export const updateBlogByIdController = async (req: Request<{
	id: string
}, {}, IBlogInputModel>, res: Response<StatusCodes>) => {
	const isUpdated = await blogsService.updateBlogByID(req.params.id, req.body)
	isUpdated.status === ResultStatus.Success ? res.sendStatus(StatusCodes.NO_CONTENT) : res.sendStatus(StatusCodes.NOT_FOUND)
}