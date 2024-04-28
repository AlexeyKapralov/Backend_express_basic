import {Request, Response} from "express";
import {IPaginatorPostViewModel} from "../models/postView.model";
import {getQueryForPosts} from "../../../common/utils/mappers";
import {postsQueryRepository} from "../../../repositories/posts/postsQuery.repository";
import {StatusCodes} from "http-status-codes";

export const getPostsController = async (req: Request<{},{},{},{[key: string]: string | undefined}>, res: Response<IPaginatorPostViewModel>) => {
    const query = getQueryForPosts(req.query)

    const result = await postsQueryRepository.getPosts(query)

    result ? res.status(StatusCodes.OK).json(result) : res.status(StatusCodes.NOT_FOUND).json()
}