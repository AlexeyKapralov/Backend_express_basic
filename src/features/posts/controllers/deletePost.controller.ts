import {Request, Response} from 'express'
import {StatusCodes} from "http-status-codes"
import {postsService} from "../postsCompositionRoot";

export const deletePostController = async (req: Request<{ id: string }>, res: Response<StatusCodes>) => {
    const isDeleted = await postsService.deletePost(req.params.id)
    isDeleted ? res.sendStatus(StatusCodes.NO_CONTENT) : res.sendStatus(StatusCodes.NOT_FOUND)
}