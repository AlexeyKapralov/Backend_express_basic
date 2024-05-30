import {Request, Response} from 'express'
import {StatusCodes} from "http-status-codes";
import {blogsQueryRepository} from "../repository/blogsQuery.repository";
import {getQueryParams} from "../../../common/utils/mappers";
import { IQueryModel } from '../../../common/types/query.model'

export const getBlogsController = async (req: Request<{}, {}, {}, IQueryModel>, res: Response) => {
    const query = getQueryParams(req.query)
    const result = await blogsQueryRepository.getBlogs(query)
    res.status(StatusCodes.OK).json(result)
}