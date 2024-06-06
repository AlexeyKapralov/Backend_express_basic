import {Request, Response} from "express"
import {StatusCodes} from "http-status-codes";
import {IPostInputModel} from "../models/postInput.model";
import {postsService} from "../postsCompositionRoot";

export const updatePostByIdController = async (req: Request<{ id: string }, {}, IPostInputModel>, res: Response) => {
    const result = await postsService.updatePost(req.params.id, req.body)
    result ? res.status(StatusCodes.NO_CONTENT).json() : res.status(StatusCodes.NOT_FOUND).json()
}