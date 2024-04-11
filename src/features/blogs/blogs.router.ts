import {Router, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

export const blogsRouter = Router({})

blogsRouter.get('/', (req:Request, res:Response)=>{
    res.status(StatusCodes.OK).json({version: '1'})
})