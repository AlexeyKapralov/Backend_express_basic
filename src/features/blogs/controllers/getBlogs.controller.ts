import {Request, Response} from 'express'
import {StatusCodes} from "http-status-codes";
import {blogsQueryRepository} from "../../../repositories/blogs/blogsQuery.repository";
import {IQueryModel} from "../../users/models/userInput.model";
import {getQueryParams} from "../../../common/utils/mappers";

export const getBlogsController = async (req: Request<{}, {}, {}, IQueryModel>, res: Response) => {
    const query = getQueryParams(req.query)
    const result = await blogsQueryRepository.getBlogs(query)
    result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
}