import {Request, Response, Router} from "express";
import {BlogInputModelType} from "./models/blogInputModelType";
import {BlogViewModelType} from "./models/blogViewModelType";
import {BlogType} from "../../db/db";
import {blogsRepository} from "../../repositories/blogs.repository";
import {StatusCodes} from "http-status-codes";
import {body, ValidationError} from "express-validator";
import {inputValidationMiddleware} from "../../middlewares/inputValidationMiddleware";

const nameValidation = body('name')
    // name: string,maxlength 15
    .isLength({min: 1, max: 15})
    .customSanitizer(value => {
        return value.toString();
    })
const descriptionValidation = body('description')
    // description: string,
    .isLength({min: 1, max: 500})
    .customSanitizer(value => {
        return value.toString();
    })
const websiteUrlValidation = body('websiteUrl')
    // websiteUrl: string, pattern for url
    .isLength({min: 1, max: 100})
    .customSanitizer(value => {
        return value.toString();
    })
    .isURL()


const getBlogViewModel = (dbBlog: BlogType): BlogViewModelType => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        description: dbBlog.description,
        websiteUrl: dbBlog.websiteUrl,
        createdAt: dbBlog.createdAt,
        isMembership: dbBlog.isMembership
    }
}

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request<{}, {}, {}, BlogInputModelType>, res: Response<BlogViewModelType[] | BlogInputModelType>) => {
    if (req.query.websiteUrl || req.query.name || req.query.description) {
        const result = await blogsRepository.getBlogs(req.query)
        res.send(result)
    } else {
        const result = await blogsRepository.getBlogs()
        res.send(result)
    }
})

blogsRouter.post('/',

    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,

    async (req: Request<{}, {}, BlogInputModelType>, res: Response<BlogViewModelType | { errors: ValidationError[] }>) => {
        const result = await blogsRepository.createBlog(req.body)
        if (result) {
            res.status(StatusCodes.CREATED).send(result)
        } else {
            res.sendStatus(StatusCodes.BAD_REQUEST)
        }
    })