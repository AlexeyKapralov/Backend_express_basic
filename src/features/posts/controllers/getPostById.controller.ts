import {Request, Response} from "express"
import {postsQueryRepository} from "../repository/postsQuery.repository"
import {StatusCodes} from "http-status-codes";

export const getPostByIdController = async (req: Request, res: Response) => {
    const result = await postsQueryRepository.getPostById(req.params.id)
    result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
}