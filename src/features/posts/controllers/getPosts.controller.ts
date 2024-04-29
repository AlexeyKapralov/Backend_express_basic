import {Request, Response} from "express";
import {IPaginatorPostViewModel} from "../models/postView.model";
import {postsQueryRepository} from "../../../repositories/posts/postsQuery.repository";
import {StatusCodes} from "http-status-codes";
import {IQueryModel} from "../../users/models/userInput.model";
import {getQueryParams} from "../../../common/utils/mappers";

export const getPostsController = async (req: Request<{},{},{},IQueryModel>, res: Response<IPaginatorPostViewModel>) => {
    const query = getQueryParams(req.query)

    const result = await postsQueryRepository.getPosts(query)

    result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
}