import {Request, Response} from "express"
import {authService} from "../service/auth.service";
import {usersQueryRepository} from "../../users/repository/usersQuery.repository";
import {StatusCodes} from "http-status-codes";
import {ResultStatus} from "../../../common/types/resultStatus.type";

export const passwordRecoveryController = async (req: Request<{}, {}, {email: string}>, res: Response) => {
    const email = req.body.email

    const user = await usersQueryRepository.findUserByLoginOrEmail(email)

    if (!user) {
        res.status(StatusCodes.NO_CONTENT).json()
        return
    }

    const recoveryStatus = await authService.recoveryPassword(email)
    switch(recoveryStatus.status) {
        case ResultStatus.NotFound:  // if (x === 'value1')
            res.status(StatusCodes.NO_CONTENT).send()
            break
        case ResultStatus.BadRequest:
            res.status(StatusCodes.BAD_REQUEST).send()
            break
        default:
            res.status(StatusCodes.NO_CONTENT).send()
            break
    }
}