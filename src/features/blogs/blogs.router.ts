import {Request, Response, Router} from "express";
import {BlogViewModel} from "./models/BlogViewModel";
import {BlogType} from "../../db/db";
import {query} from "express-validator";
import {HTTP_STATUSES} from "../../utils/utils";
import {blogsRepository} from "../../repositories/blogs-repository";

export const getBlogsRouter = () => {
    const blogsRouter = Router({})

    const getBlogViewModel = (dbBlog: BlogType) => {
        return {
            id: dbBlog.id,
            name: dbBlog.name,
            description: dbBlog.description,
            websiteUrl: dbBlog.websiteUrl
        }
    }

    blogsRouter.get('/',
        (req: Request<{},{},{},{name: string}>, res: Response<BlogViewModel[] | BlogViewModel>) => {
            const foundedBlogs =  blogsRepository.getBlogs(req.query.name)
            res.status(HTTP_STATUSES.OK_200).json(foundedBlogs.map(getBlogViewModel))
        })




    return blogsRouter
}