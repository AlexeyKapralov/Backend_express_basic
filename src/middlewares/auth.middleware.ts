import {NextFunction, Request, Response} from 'express'
import {StatusCodes} from 'http-status-codes'
import {jwtService} from "../common/adapters/jwt.service";
import {usersQueryRepository} from "../repositories/users/usersQuery.repository";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth: string | undefined = req.headers.authorization
    if (!auth) {
        res.status(StatusCodes.UNAUTHORIZED).json({})
        return
    }

    const token = req.headers.authorization!.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)

    if (userId) {
        const result = await usersQueryRepository.findUserById(userId.toString())
        req.userId = result!.id
        next()
    }
    res.status(StatusCodes.UNAUTHORIZED).json({})
}
