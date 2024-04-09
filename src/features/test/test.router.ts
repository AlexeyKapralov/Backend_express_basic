import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../../utils/utils";
import {db} from "../../db/db";

export const testRouter = Router({})

testRouter.delete('/', (req: Request, res: Response) => {
    db.blogs = []
    db.posts = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})