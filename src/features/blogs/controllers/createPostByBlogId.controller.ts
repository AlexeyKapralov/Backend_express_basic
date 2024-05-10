import { Request, Response } from 'express'
import { IBlogPostInputModel } from '../models/blogInput.model'
import { IPostViewModel } from '../../posts/models/postView.model'
import { blogsService } from '../../../service/blogs.service'
import { StatusCodes } from 'http-status-codes'
import { ResultStatus } from '../../../common/types/resultStatus.type'

export const createPostByBlogIdController = async (req: Request<{ id: string }, {}, IBlogPostInputModel>, res: Response<IPostViewModel>) => {
    const result = await blogsService.createPostByBlogId(req.params.id, req.body)
    result.status === ResultStatus.Success
      ? res.status(StatusCodes.CREATED).send(result.data!)
      : res.status(StatusCodes.NOT_FOUND).send()
}