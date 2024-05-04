import { Router } from 'express'
import { getCommentByIdController } from './controllers/getCommentById.controller'
import { updateCommentByIdController } from './controllers/updateCommentById.controller'
import { deleteCommentByIdController } from './controllers/deleteCommentById.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { contentCommentValidation } from '../../common/validation/express-validation'

export const commentsRouter = Router({})

commentsRouter.get(`/:commentId`, getCommentByIdController)
commentsRouter.put(`/:commentId`,
	authMiddleware,
	contentCommentValidation,
	updateCommentByIdController
)
commentsRouter.delete(`/:commentId`,
	authMiddleware,
	deleteCommentByIdController
)
