import {Request, Response} from 'express'
import {loginService} from '../../../service/login.service'
import {StatusCodes} from 'http-status-codes'
import {ILoginInputModel} from "../models/loginInputModel";
import {ResultType} from "../../../common/types/result.type";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {jwtService} from "../../../common/adapters/jwt.service";
import {usersRepository} from "../../../repositories/users/users.repository";
import {ILoginSuccessViewModel} from "../../../common/types/loginSuccessView.model";

// export interface

export const loginController = async (
    req: Request<{}, {}, ILoginInputModel>,
    res: Response<ILoginSuccessViewModel>
) => {
    const result: ResultType = await loginService.loginUser(req.body)

    let accessToken
    if (result.status === ResultStatus.Success) {
        const result = await usersRepository.findUserByLoginOrEmail(req.body.loginOrEmail)
        accessToken = jwtService.createJwt(result!)
    }

    result.status === ResultStatus.Success
        ? res.status(StatusCodes.OK).json(
            {
                accessToken: accessToken!
            }
        )
        : res.status(StatusCodes.UNAUTHORIZED).send()
}
