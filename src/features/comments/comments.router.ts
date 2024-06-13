import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import {contentCommentValidation, likesStatusValidation} from '../../common/validation/express-validation'
import { inputValidationMiddleware } from '../../middlewares/inputValidation.middleware'
import {container} from "../../ioc";
import {CommentsController} from "./comments.controller";

export const commentsRouter = Router({})
const commentsController = container.resolve(CommentsController)

commentsRouter.put(`/:commentId`,
	authMiddleware,
	contentCommentValidation,
	inputValidationMiddleware,
	commentsController.getCommentById.bind(commentsController)
)
commentsRouter.delete(`/:commentId`,
	authMiddleware,
	commentsController.deleteCommentById.bind(commentsController)
)
commentsRouter.get(`/:commentId`,
	commentsController.getCommentById.bind(commentsController)
)
commentsRouter.put(`/:commentId/like-status`,
	authMiddleware,
	likesStatusValidation,
	inputValidationMiddleware,
	commentsController.likeStatusController.bind(commentsController)
)
