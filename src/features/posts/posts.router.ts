import {Router} from "express";
import {
    blogIdInBodyValidation, contentCommentValidation,
    contentValidation, likeStatusValidation,
    pageNumberValidation,
    pageSizeValidation, postIdParamValidation, postIdValidation,
    shortDescriptionValidation,
    sortByValidation,
    sortDirectionValidation,
    titleValidation
} from '../../common/validation/express-validation'
import {authMiddleware} from "../../middlewares/auth.middleware";
import {inputValidationMiddleware} from "../../middlewares/inputValidation.middleware";
import {container} from "../../ioc";
import {PostsController} from "./posts.controller";
import {getUserIdFromTokenMiddleware} from "../../middlewares/getUserIdFromToken.middleware";

export const postsRouter = Router({})
const postsController = container.resolve(PostsController)

postsRouter.put('/:postId/like-status',
    authMiddleware,
    likeStatusValidation,
    inputValidationMiddleware,
    postsController.likePost.bind(postsController)
)

postsRouter.get('/:id/comments',
    pageNumberValidation,
    pageSizeValidation,
    sortByValidation,
    sortDirectionValidation,
    postsController.getComments.bind(postsController)
)

postsRouter.post('/:postId/comments',
    authMiddleware,
    contentCommentValidation,
    inputValidationMiddleware,
    postsController.createCommentForPost.bind(postsController),
)

postsRouter.get('/',
    getUserIdFromTokenMiddleware,
    pageNumberValidation,
    pageSizeValidation,
    sortByValidation,
    sortDirectionValidation,
    postsController.getPosts.bind(postsController)
)

postsRouter.post('/',
    authMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdInBodyValidation,
    inputValidationMiddleware,
    postsController.createPost.bind(postsController),
)

postsRouter.get('/:id',
    getUserIdFromTokenMiddleware,
    postIdValidation,
    inputValidationMiddleware,
    postsController.getPostById.bind(postsController)
)

postsRouter.put('/:id',
    authMiddleware,
    blogIdInBodyValidation,
    contentValidation,
    titleValidation,
    shortDescriptionValidation,
    inputValidationMiddleware,
    postsController.updatePostById.bind(postsController)
)

postsRouter.delete('/:id',
    authMiddleware,
    titleValidation,
    postsController.deletePost.bind(postsController)
)


