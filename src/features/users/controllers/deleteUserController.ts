import {Request, Response} from 'express'
import {usersService} from "../../../service/users.service";
import {StatusCodes} from "http-status-codes";

export const deleteUserController = async (req: Request<{ id: string }>, res: Response<StatusCodes>) => {
    const {id} = req.params
    const result = await usersService.deleteUser(id)
    return result ? res.status(StatusCodes.NO_CONTENT).send() : res.status(StatusCodes.NOT_FOUND).send()
}