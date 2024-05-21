import {NextFunction, Request, Response} from 'express'
import {StatusCodes} from 'http-status-codes'
import {addSeconds} from "date-fns";
import {db} from "../db/db";

export const rateLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const ip = req.ip || ''
    const url = req.baseUrl
    const dateRequest = addSeconds(new Date(), -10)


    const limitRequest = await db.getCollection().rateLimitCollection.find({ip, url, date: {$gt: dateRequest}}).toArray()

    if (limitRequest.length > 5) {
        res.status(StatusCodes.TOO_MANY_REQUESTS).json()
    }
    await db.getCollection().rateLimitCollection.insertOne({ip, url, date: new Date()})
    next()
}
