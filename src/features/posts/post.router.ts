import {Request, Response, Router} from 'express'
import {PostInputModelType} from './models/postInputModelType'
import {PostViewModelType} from './models/postViewModelType'
import {postsRepository} from '../../repositories/posts.repository'
import {authMiddleware} from '../../middlewares/auth.middleware'
import {body, ValidationError} from 'express-validator'
import {StatusCodes} from 'http-status-codes'
import {inputValidationMiddleware} from '../../middlewares/inputValidationMiddleware'
import {blogsCollection} from '../../db/db'

const titleValidation = body('title')
    // name: string,maxlength 15
    // .optional()
    .trim()
    .isLength({min: 1, max: 30})
    .exists()
// .customSanitizer(value => {
// 	return value.toString()
// })

const shortDescriptionValidation = body('shortDescription')
    // name: string,maxlength 15
    // .optional()
    .trim()
    .isLength({min: 1, max: 100})
    .exists()
// .customSanitizer(value => {
// 	return value.toString()
// })

const contentValidation = body('content')
    // name: string,maxlength 15
    // .optional()
    .trim() // превращает в строку
    .isLength({min: 1, max: 1000})
    .exists()
// .customSanitizer(value => {
//     return value.toString()
// })

const blogIdValidation = body('blogId')
    // name: string,maxlength 15
    // .optional()
    .trim()
    .isLength({min: 1, max: 1000})
    .custom(async value => {
        const foundBlog = await blogsCollection.findOne({_id: value})
        if (!foundBlog) {
            throw new Error('Unknown blogId')
        }
    })
    .exists()
// .customSanitizer(value => {
// 	return value.toString()
// })

export const postRouter = Router({})

postRouter.get(
    '/',
    async (
        req: Request<{}, {}, {}, PostInputModelType>,
        res: Response<PostViewModelType[] | PostInputModelType>
    ) => {
        if (
            req.query.title ||
            req.query.shortDescription ||
            req.query.content ||
            req.query.blogId
        ) {
            const result = await postsRepository.getPosts(req.query)
            res.send(result)
        } else {
            const result = await postsRepository.getPosts()
            res.send(result)
        }
    }
)

postRouter.get(
    '/:id',
    async (
        req: Request<{ id: string }>,
        res: Response<PostViewModelType | { errors: ValidationError[] }>
    ) => {
        const result = await postsRepository.getPostById(req.params.id)

        if (result) {
            res.status(StatusCodes.OK).json(result)
        } else {
            res.status(StatusCodes.NOT_FOUND).json()
        }
    }
)

postRouter.post(
    '/',

    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,

    async (
        req: Request<{}, {}, PostInputModelType>,
        res: Response<PostViewModelType | { errors: ValidationError[] }>
    ) => {
        const result = await postsRepository.createPost(req.body)
        if (result) {
            res.status(StatusCodes.CREATED).json(result)
        } else {
            res.sendStatus(StatusCodes.BAD_REQUEST)
        }
    }
)

postRouter.put(
    '/:id',

    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,

    async (
        req: Request<{ id: string }, {}, PostInputModelType>,
        res: Response<{ errors: ValidationError[] }>
    ) => {
        const result = await postsRepository.updatePost(req.body, req.params.id)

        if (!result) {
            res.status(StatusCodes.NOT_FOUND).json()
        } else {
            res.status(StatusCodes.NO_CONTENT).json()
        }
    }
)

postRouter.delete(
    '/:id',
    authMiddleware,
    async (req: Request<{ id: string }>, res: Response) => {
        const result = await postsRepository.deletePost(req.params.id)
        if (result) {
            res.status(StatusCodes.NO_CONTENT).json()
        } else {
            res.status(StatusCodes.NOT_FOUND).json()
        }
    }
)
