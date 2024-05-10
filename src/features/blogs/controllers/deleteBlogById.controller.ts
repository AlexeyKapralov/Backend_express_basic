import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { blogsService } from '../../../service/blogs.service'
import { ResultStatus } from '../../../common/types/resultStatus.type'

export const deleteBlogByIdController = async (req: Request<{id: string}>, res: Response<StatusCodes>) => {
    const isDeleted = await blogsService.deleteBlogByID(req.params.id)
    isDeleted.status === ResultStatus.Success ? res.sendStatus(StatusCodes.NO_CONTENT) : res.sendStatus(StatusCodes.NOT_FOUND)
}