import {Request, Response} from 'express'
import {StatusCodes} from "http-status-codes";
import {blogsService} from "../../../service/blogs.service";

export const deleteBlogByIdController = async (req: Request<{id: string}>, res: Response<StatusCodes>) => {
    const isDeleted = await blogsService.deleteBlogByID(req.params.id)
    isDeleted ? res.sendStatus(StatusCodes.NO_CONTENT) : res.sendStatus(StatusCodes.NOT_FOUND)
}