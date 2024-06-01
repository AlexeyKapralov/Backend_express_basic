import {Request, Response} from "express";
import {IBlogInputModel} from "../models/blogInput.model";
import {IBlogViewModel} from "../models/blogView.model";
import {blogsService} from "../sevice/blogs.service";
import {StatusCodes} from "http-status-codes";

export const createBlogsController = async (req: Request<{},{},IBlogInputModel>, res: Response<IBlogViewModel>) => {
    const result = await blogsService.createBlog(req.body)

    result.data ? res.status(StatusCodes.CREATED).send(result.data) : res.status(StatusCodes.NOT_FOUND).send()
}