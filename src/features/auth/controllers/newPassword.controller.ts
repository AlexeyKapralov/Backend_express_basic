import {Request, Response} from 'express'
import {newPasswordRecoveryInputModel} from "../models/newPasswordRecoveryInput.model";
import {authService} from "../service/auth.service";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";

export const newPasswordController = async (req: Request<{},{},newPasswordRecoveryInputModel>, res: Response) => {
    const newPassword = req.body.newPassword
    const recoveryCode = req.body.recoveryCode

    const updatedPasswordStatus = await authService.setNewPassword(recoveryCode, newPassword)

    if (updatedPasswordStatus.status === ResultStatus.Success) {
        res.status(StatusCodes.NO_CONTENT).send()
        return
    }
    res.status(StatusCodes.BAD_REQUEST).send()

}