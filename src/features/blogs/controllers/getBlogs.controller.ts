import {Request, Response} from 'express'
import {getQueryForBlogs} from "../../../common/utils/mappers";
import {StatusCodes} from "http-status-codes";
import {blogsQueryRepository} from "../../../repositories/blogs/blogsQuery.repository";

export const getBlogsController = async (req: Request<{}, {}, {}, { [key: string]: string | undefined }>, res: Response) => {
    const query = getQueryForBlogs(req.query)
    const result = await blogsQueryRepository.getBlogs(query)
    result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
}