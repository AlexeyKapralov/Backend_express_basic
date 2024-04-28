import {Request, Response} from "express";
import {IPaginatorPostViewModel} from "../../posts/models/postView.model";
import {getQueryForBlogs} from "../../../common/utils/mappers";
import {blogsQueryRepository} from "../../../repositories/blogs/blogsQuery.repository";
import {StatusCodes} from "http-status-codes";

export const getPostsByBlogIDController = async (
    req: Request<{ id: string }, {}, {}, { [key: string]: string | undefined }>,
    res: Response<IPaginatorPostViewModel>) =>
{
    const query = getQueryForBlogs(req.query)

    const result = await blogsQueryRepository.getPostsByBlogID(req.params.id, query)

    result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
}