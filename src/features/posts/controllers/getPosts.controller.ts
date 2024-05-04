import {Request, Response} from "express";
import {postsQueryRepository} from "../../../repositories/posts/postsQuery.repository";
import {StatusCodes} from "http-status-codes";
import {IQueryModel} from "../../users/models/userInput.model";
import {getQueryParams} from "../../../common/utils/mappers";
import { IPaginator } from '../../../common/types/paginator'
import { IPostViewModel } from '../models/postView.model'

export const getPostsController = async (req: Request<{},{},{},IQueryModel>, res: Response<IPaginator<IPostViewModel>>) => {
    const query = getQueryParams(req.query)

    const result = await postsQueryRepository.getPosts(query)

    result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
}