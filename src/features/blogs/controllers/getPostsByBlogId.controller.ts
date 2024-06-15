import {Request, Response} from "express";
import {blogsQueryRepository} from "../repository/blogsQuery.repository";
import {StatusCodes} from "http-status-codes";
import {getQueryParams} from "../../../common/utils/mappers";
import { IPaginator } from '../../../common/types/paginator'
import { IPostViewModel } from '../../posts/models/postView.model'
import { IQueryInputModel } from '../../../common/types/query.model'

export const getPostsByBlogIDController = async (
    req: Request<{ id: string }, {}, {}, IQueryInputModel>,
    res: Response<IPaginator<IPostViewModel>>) =>
{
    const query = getQueryParams(req.query)

    const result = await blogsQueryRepository.getPostsByBlogID(req.params.id, query, req.userId || null)

    result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
}