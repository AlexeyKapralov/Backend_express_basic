import {Request, Response} from 'express'
import {loginService} from '../../../service/login.service'
import {StatusCodes} from 'http-status-codes'
import {ILoginInputModel} from "../models/loginInput.model";
import {ResultType} from "../../../common/types/result.type";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {jwtService} from "../../../common/adapters/jwt.service";
import {ILoginSuccessViewModel} from "../../../common/types/loginSuccessView.model";
import { getUserViewModel } from '../../../common/utils/mappers'
import { usersQueryRepository } from '../../../repositories/users/usersQuery.repository'
import {addSeconds} from "date-fns";

export const loginController = async (
    req: Request<{}, {}, ILoginInputModel>,
    res: Response<ILoginSuccessViewModel>
) => {
    const result: ResultType<{ accessToken: string; refreshToken: string } | null> = await loginService.loginUser(req.body)

    result.status === ResultStatus.Success
        ? res
            .cookie('refreshToken',  result.data!.refreshToken, {httpOnly: true, secure: true, expires : addSeconds( new Date(), 20 )})
            .status(StatusCodes.OK).json(
            {
                accessToken: result.data!.accessToken
            })

        : res
            .status(StatusCodes.UNAUTHORIZED).send()
}
