import { Router } from 'express'
import { getBlogsController } from './getBlogsController'
import { blogsCollection } from '../../db/db'
import { StatusCodes } from 'http-status-codes'

export const BlogsRouter = Router({})

BlogsRouter.get('/', getBlogsController)
