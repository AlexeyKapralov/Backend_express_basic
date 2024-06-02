import {Router} from "express";
import {getPostsController} from "./controllers/getPosts.controller";
import {createPostController} from "./controllers/createPost.controller";
import {
    blogIdInBodyValidation, contentCommentValidation,
    contentValidation,
    pageNumberValidation,
    pageSizeValidation,
    shortDescriptionValidation,
    sortByValidation,
    sortDirectionValidation,
    titleValidation
} from '../../common/validation/express-validation'
import {authMiddleware} from "../../middlewares/auth.middleware";
import {inputValidationMiddleware} from "../../middlewares/inputValidation.middleware";
import {getPostByIdController} from "./controllers/getPostById.controller";
import {updatePostByIdController} from "./controllers/updatePostById.controller";
import {deletePostController} from "./controllers/deletePost.controller";
import { createCommentForPost } from './controllers/createCommentForPost.controller'
import { getCommentsController } from './controllers/getComments.controller'

export const postsRouter = Router({})


postsRouter.get('/:id/comments',
    pageNumberValidation,
    pageSizeValidation,
    sortByValidation,
    sortDirectionValidation,
    getCommentsController
)

postsRouter.post('/:postId/comments',
    authMiddleware,
    contentCommentValidation,
    inputValidationMiddleware,
    createCommentForPost,
)

postsRouter.get('/',
    pageNumberValidation,
    pageSizeValidation,
    sortByValidation,
    sortDirectionValidation,
    getPostsController
)

postsRouter.post('/',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdInBodyValidation,
    inputValidationMiddleware,
    createPostController,
)

postsRouter.get('/:id',
    getPostByIdController
)

postsRouter.put('/:id',
    authMiddleware,
    blogIdInBodyValidation,
    contentValidation,
    titleValidation,
    shortDescriptionValidation,
    inputValidationMiddleware,
    updatePostByIdController
)

postsRouter.delete('/:id',
    authMiddleware,
    titleValidation,
    deletePostController
)


