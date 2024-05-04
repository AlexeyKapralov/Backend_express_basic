import {Request, Response} from 'express'
import {StatusCodes} from "http-status-codes";
import {IQueryModel} from "../models/userInput.model";
import {usersQueryRepository} from "../../../repositories/users/usersQuery.repository";
import {getQueryParams} from "../../../common/utils/mappers";
import { IPaginator } from '../../../common/types/paginator'
import { IUserViewModel } from '../models/userView.model'

export const getUsersController = async (
    req: Request<{}, {}, {}, IQueryModel>,
    res: Response<IPaginator<IUserViewModel>>
) => {
    const query: IQueryModel = getQueryParams(req.query)
    const result = await usersQueryRepository.findUsers(query)
    result !== undefined ? res.status(StatusCodes.OK).send(result) : res.status(StatusCodes.NOT_FOUND).send()
}
