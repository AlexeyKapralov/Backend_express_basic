import {Router} from "express";
import {
    blogIdInBodyValidation, contentCommentValidation,
    contentValidation,
    pageNumberValidation,
    pageSizeValidation, postIdValidation,
    shortDescriptionValidation,
    sortByValidation,
    sortDirectionValidation,
    titleValidation
} from '../../common/validation/express-validation'
import {authMiddleware} from "../../middlewares/auth.middleware";
import {inputValidationMiddleware} from "../../middlewares/inputValidation.middleware";
import {container} from "../../ioc";
import {PostsController} from "./posts.controller";

export const postsRouter = Router({})
const postsController = container.resolve(PostsController)

// postsRouter.get('/:id/like-status',
//     postsController.likeStatus.bind(postsController)
// )

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


