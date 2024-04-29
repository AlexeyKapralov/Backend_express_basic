import {Request, Response} from "express";
import {IPaginatorPostViewModel} from "../../posts/models/postView.model";
import {blogsQueryRepository} from "../../../repositories/blogs/blogsQuery.repository";
import {StatusCodes} from "http-status-codes";
import {getQueryParams} from "../../../common/utils/mappers";
import {IQueryModel} from "../../users/models/userInput.model";

export const getPostsByBlogIDController = async (
    req: Request<{ id: string }, {}, {}, IQueryModel>,
    res: Response<IPaginatorPostViewModel>) =>
{
    const query = getQueryParams(req.query)

    const result = await blogsQueryRepository.getPostsByBlogID(req.params.id, query)

    result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
}