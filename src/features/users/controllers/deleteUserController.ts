import {Request, Response} from 'express'
import {StatusCodes} from "http-status-codes";
import {ResultStatus} from "../../../common/types/resultStatus.type";
import {usersService} from "../usersCompositionRoot";

export const deleteUserController = async (req: Request<{ id: string }>, res: Response<StatusCodes>) => {
    const {id} = req.params
    const result = await usersService.deleteUser(id)
    return result.status === ResultStatus.Success ? res.status(StatusCodes.NO_CONTENT).send() : res.status(StatusCodes.NOT_FOUND).send()
}