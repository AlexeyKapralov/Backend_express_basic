import { Request, Response } from 'express'
import { IPostInputModel } from '../models/postInput.model'
import { IPostViewModel } from '../models/postView.model'
import { postsService } from '../service/posts.service'
import { StatusCodes } from 'http-status-codes'
import { ResultStatus } from '../../../common/types/resultStatus.type'

export const createPostController = async (req: Request<{},{},IPostInputModel>, res:Response<IPostViewModel>) => {
    const result = await postsService.createPost(req.body)
    result.status === ResultStatus.Success ? res.status(StatusCodes.CREATED).json(result.data!) : res.sendStatus(StatusCodes.BAD_REQUEST)
}