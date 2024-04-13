import {Router, Request, Response} from "express";
import {blogsCollection} from "../../db/db";
import {StatusCodes} from "http-status-codes";

export const testRouter = Router({})

testRouter.delete( '/', async (req:Request, res:Response) => {
    await blogsCollection.deleteMany({})
    res.sendStatus(StatusCodes.NO_CONTENT)
})