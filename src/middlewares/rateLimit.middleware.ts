import {NextFunction, Request, Response} from 'express'
import {StatusCodes} from 'http-status-codes'
import {addSeconds} from "date-fns";
import {RateLimitModel} from "../features/rateLimits/domain/rateLimits.entity";

export const rateLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const ip = req.ip || ''
    const url = req.url
    const dateRequest = addSeconds(new Date(), -10)

    //todo возможно стоит переписать чтобы здесь не было обращения к бд а сделать через сервис
    const limitRequest = await RateLimitModel.find({ip, url, date: {$gt: dateRequest}}).lean()

    if (limitRequest.length >= 5) {
        res.status(StatusCodes.TOO_MANY_REQUESTS).send()
        return
    }
    await RateLimitModel.create({ip, url, date: new Date()})
    next()
}
