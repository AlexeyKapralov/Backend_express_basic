import {Request, Response} from 'express'
import {IPaginatorUserViewModel} from '../models/userView.model'
import {StatusCodes} from "http-status-codes";
import {getQueryForUsers} from "../../../common/utils/mappers";
import {IUserQueryModel} from "../models/userInput.model";
import {usersQueryRepository} from "../../../repositories/users/usersQuery.repository";

export const getUsersController = async (
    //TODO: Здесь для query нельзя сделать определённый тип, потому что в query могут попадать всякие разные
    // параметры и мы не можем им определить тип, а то я попытался так сделать и TS говорить про ошибку, т.е. по
    // сути можно [key: string... не писать по сути же?
    req: Request<{}, {}, {}, { [key: string]: string | undefined }>,
    res: Response<IPaginatorUserViewModel>
) => {
    //TODO: в query мы можем передать всё что угодно и потом этот объект мапить в любом случае надо, правильно?
    // чтобы типам соответствовало всё дальше в сервисе
    const query: IUserQueryModel = getQueryForUsers(req.query)
    const result = await usersQueryRepository.findUsers(query)
    result !== undefined ? res.status(StatusCodes.OK).send(result) : res.status(StatusCodes.NOT_FOUND).send()
}
