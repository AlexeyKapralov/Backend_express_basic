import {Request, Response} from 'express'
import {StatusCodes} from "http-status-codes";
import {IBlogViewModel} from "../models/blogView.model";
import {blogsQueryRepository} from "../../../repositories/blogs/blogsQuery.repository";

export const getBlogByIdController = async (req: Request<{ id: string }>, res: Response<IBlogViewModel>) => {
    const result = await blogsQueryRepository.getBlogByID(req.params.id)
    result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
}