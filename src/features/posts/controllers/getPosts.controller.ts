import {Request, Response} from "express";
import {postsQueryRepository} from "../repository/postsQuery.repository";
import {StatusCodes} from "http-status-codes";
import {getQueryParams} from "../../../common/utils/mappers";
import { IPaginator } from '../../../common/types/paginator'
import { IPostViewModel } from '../models/postView.model'
import { IQueryModel } from '../../../common/types/query.model'

export const getPostsController = async (req: Request<{},{},{},IQueryModel>, res: Response<IPaginator<IPostViewModel>>) => {
    const query = getQueryParams(req.query)

    const result = await postsQueryRepository.getPosts(query)

    res.status(StatusCodes.OK).json(result)
}