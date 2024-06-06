import {Request, Response} from 'express'
import {StatusCodes} from 'http-status-codes'
import {ILoginInputModel} from "../models/loginInput.model";
import {ResultType} from "../../../common/types/result.type";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {ILoginSuccessViewModel} from "../../../common/types/loginSuccessView.model";
import {addSeconds} from "date-fns";
import {authService} from "../authCompositionRoot";

export const loginController = async (
    req: Request<{}, {}, ILoginInputModel>,
    res: Response<ILoginSuccessViewModel>
) => {
    const result: ResultType<{ accessToken: string; refreshToken: string } | null> =
        await authService.loginUser(
            req.body,
            req.headers['user-agent'] || 'unknown Device Name',
            req.ip || 'Unknown IP'
        )

    result.status === ResultStatus.Success
        ? res
            .cookie('refreshToken', result.data!.refreshToken, {
                httpOnly: true,
                secure: true,
                expires: addSeconds(new Date(), 20)
            })
            .status(StatusCodes.OK).json(
                {
                    accessToken: result.data!.accessToken
                })

        : res
            .status(StatusCodes.UNAUTHORIZED).send()
}
