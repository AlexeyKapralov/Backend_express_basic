import {Request, Response} from 'express'
import {IBlogPostInputModel} from "../models/blogInput.model";
import {IPostViewModel} from "../../posts/models/postView.model";
import {blogsService} from "../../../service/blogs.service";
import {StatusCodes} from "http-status-codes";

export const createPostByBlogIdController = async (req: Request<{ id: string }, {}, IBlogPostInputModel>, res: Response<IPostViewModel>) => {
    const result = await blogsService.createPostByBlogId(req.params.id, req.body)
    result ? res.status(StatusCodes.CREATED).send(result) : res.status(StatusCodes.NOT_FOUND).send()
}