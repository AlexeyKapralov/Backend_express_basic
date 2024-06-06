import {Request, Response} from 'express'
import {StatusCodes} from "http-status-codes";
import {getQueryParams} from "../../../common/utils/mappers";
import { IPaginator } from '../../../common/types/paginator'
import { IUserViewModel } from '../models/userView.model'
import { IQueryModel } from '../../../common/types/query.model'
import {usersQueryRepository} from "../repository/usersQuery.repository";

export const getUsersController = async (
    req: Request<{}, {}, {}, IQueryModel>,
    res: Response<IPaginator<IUserViewModel>>
) => {
    const query: IQueryModel = getQueryParams(req.query)
    const result = await usersQueryRepository.findUsers(query)
    res.status(StatusCodes.OK).send(result)
}
