import {query, Request, Response} from "express";
import {blogsCollection, BlogType} from "../../db/db";
import {StatusCodes} from "http-status-codes";
import {blogViewModelType} from "./models/blogViewModelType";
import {blogsService} from "../../services/blogs.service";
import {getQueryWithDefault} from "../../utils";



export const getBlogsController = async (req:Request<{}, {}, {}, {[key: string]: string | undefined}>, res:Response<any>) => {
    const blogs = await blogsService.findBlogs()
    const query = req.query

    await res.status(StatusCodes.OK).json(getQueryWithDefault(query));
}