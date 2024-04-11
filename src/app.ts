import express from 'express'
import {Request, Response} from 'express'
import {StatusCodes} from "http-status-codes";

export const app = express()

const jsonMiddleware = express.json()

app.use(jsonMiddleware)

app.get('/', (res:Request, req:Response) => {
    req.status(StatusCodes.OK).json({version: '1'})
})