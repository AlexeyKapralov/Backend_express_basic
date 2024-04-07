import {Request, Response, Router} from "express";
import {dbType} from "../../db/db";
import {HTTP_STATUSES} from "../../utils/utils";

export const getTestRouter = (db: dbType) => {
    const testRouter = Router({})

    testRouter.delete('/', (req: Request, res: Response) => {
        db.blogs = []
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return testRouter
}