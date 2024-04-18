import {Router} from "express";
import {getBlogsController} from "./getBlogsController";

export const BlogsRouter = Router({})

BlogsRouter.get('/', getBlogsController)