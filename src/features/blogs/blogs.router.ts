import {Request, Response, Router} from "express";
import {BlogViewModel} from "./models/BlogViewModel";
import {BlogType} from "../../db/db";
import {HTTP_STATUSES} from "../../utils/utils";
import {blogsRepository} from "../../repositories/blogs-repository";
import {BlogInputModel} from "./models/BlogInputModel";
import {body, ValidationError} from "express-validator";
import {inputValidationMiddleware} from "../../middlewares/inputValidationMiddleware";
import {authMiddleware} from "../../middlewares/auth-middleware";

//validation
//escape для защиты от XSS
const nameValidation = body('name')
    .trim()
    .isLength({min: 1, max: 15}).withMessage('max length 15 symbols')
    .escape()
const descriptionValidation = body('description')
    .trim()
    .isLength({min: 1, max: 500})
    .escape()
const webSiteUrlValidation = body('websiteUrl')
    .trim()
    .isURL()
    // body('websiteUrl').matches('`^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n').withMessage('should
    // be URL template').escape()
    .isLength({min: 1, max: 100})
    .withMessage('should be URL template')
// .escape()


//router
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

    //get blogs
    blogsRouter.get('/',
        (req: Request<{}, {}, {}, { name: string }>, res: Response<BlogViewModel[] | BlogViewModel>) => {
            const foundedBlogs = blogsRepository.getBlogs(req.query.name)
            res.status(HTTP_STATUSES.OK_200).json(foundedBlogs.map(getBlogViewModel))
        })

    // create post
    blogsRouter.post('/',

        authMiddleware,
        nameValidation,
        descriptionValidation,
        webSiteUrlValidation,
        inputValidationMiddleware,

        (req: Request<{}, {}, BlogInputModel, {}>, res: Response<BlogViewModel[] | BlogViewModel | { errors: ValidationError[] }>) => {
            const createdBlog = blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
            if (createdBlog) {
                res.status(HTTP_STATUSES.CREATED_201).json(createdBlog)
            } else {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            }
        })

    //get blog by ID
    blogsRouter.get('/:id',
        // idValidation,
        // inputValidationMiddleware,
        (req: Request<{ id: string }>, res: Response<BlogViewModel>) => {
            const foundedBlog = blogsRepository.getBlogById(req.params.id)

            if (foundedBlog) {
                res.status(HTTP_STATUSES.OK_200).json(getBlogViewModel(foundedBlog))
                return
            }
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        })

    //update blogs
    blogsRouter.put('/:id',

        authMiddleware,
        nameValidation,
        descriptionValidation,
        webSiteUrlValidation,
        inputValidationMiddleware,

        (req: Request<{ id: string }, {}, BlogInputModel>, res: Response) => {
            const isUpdated = blogsRepository.updateBlog(req.params.id, req.body)
            if (isUpdated) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }
        }
    )

    //delete blog
    blogsRouter.delete('/:id',

        authMiddleware,
        (req: Request<{ id: string }>, res: Response) => {
            const isDeleted = blogsRepository.deleteBlog(req.params.id)

            if (isDeleted) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }
        }
    )


    return blogsRouter
}