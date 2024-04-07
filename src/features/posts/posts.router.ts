import {Request, Response, Router} from "express";
import {postsRepository} from "../../repositories/posts-repository";
import {PostInputModel} from "./models/PostInputModel";
import {PostViewModel} from "./models/PostViewModel";
import {PostType} from "../../db/db";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../../middlewares/inputValidationMiddleware";
import {blogsRepository} from "../../repositories/blogs-repository";
import {HTTP_STATUSES} from "../../utils/utils";
import {authMiddleware} from "../../middlewares/auth-middleware";


const getPostViewModel = (dbPost: PostType): PostViewModel => {
    return {
        id: dbPost.id,
        blogId: dbPost.blogId,
        content: dbPost.content,
        title: dbPost.title,
        blogName: dbPost.blogName,
        shortDescription: dbPost.shortDescription
    }
}

const titleValidation = body('title')
    .trim()
    .isLength({min: 1, max: 30})
    .escape()
const shortDescriptionValidation = body('shortDescription')
    .trim()
    .isLength({min: 1, max: 100})
    .escape()
const contentValidation = body('content')
    .trim()
    .isLength({min: 1, max: 1000})
    .escape()
const blogIdValidation = body('blogId')
    .custom(async value => {
        const foundedBlog = await blogsRepository.getBlogById(value)
        if (!foundedBlog) {
            throw new Error(`BlogId ${value} no founded`);
        }
    })
    .trim()
    .isLength({min: 1, max: 1000})
    .escape()


export const getPostsRouter = () => {
    const courseRouter = Router({})

    courseRouter.get('/',

        (req: Request<{}, {}, {}, PostInputModel>, res: Response<PostViewModel[]>) => {
            const foundPosts = postsRepository.getPosts(req.query.title || undefined)
            if (foundPosts) {
                res.status(HTTP_STATUSES.OK_200).json(foundPosts.map(getPostViewModel))
            }
        }
    )

    courseRouter.post('/',

        authMiddleware,
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        blogIdValidation,
        inputValidationMiddleware,

        (req: Request<{}, {}, PostInputModel>, res: Response<PostViewModel>) => {
            const createdPost: PostViewModel | undefined = postsRepository.createPost(req.body)

            if (createdPost) {
                res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
            } else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        }
    )

    courseRouter.put('/:id',

        authMiddleware,
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        blogIdValidation,
        inputValidationMiddleware,

        (req: Request<{ id: string }>, res: Response) => {
            const isUpdated = postsRepository.updatePost(req.params.id, req.body)
            if (isUpdated) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }
        }
    )

    courseRouter.get('/:id',

        (req: Request<{ id: string }>, res: Response) => {
            const foundedPost = postsRepository.getPostById(req.params.id)

            if (foundedPost) {
                res.status(HTTP_STATUSES.OK_200).send(
                    foundedPost
                )
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }
        }
    )

    courseRouter.delete('/:id',

        authMiddleware,

        (req: Request<{ id: string }>, res: Response) => {
            const isDel = postsRepository.deletePost(req.params.id)

            if (isDel) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }
        }
    )

    return courseRouter
}