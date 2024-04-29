import {Request, Response} from 'express'
import {IPaginatorUserViewModel} from '../models/userView.model'
import {StatusCodes} from "http-status-codes";
import {IQueryModel} from "../models/userInput.model";
import {usersQueryRepository} from "../../../repositories/users/usersQuery.repository";
import {getQueryParams} from "../../../common/utils/mappers";

export const getUsersController = async (
    req: Request<{}, {}, {}, IQueryModel>,
    res: Response<IPaginatorUserViewModel>
) => {
    const query: IQueryModel = getQueryParams(req.query)
    const result = await usersQueryRepository.findUsers(query)
    result !== undefined ? res.status(StatusCodes.OK).send(result) : res.status(StatusCodes.NOT_FOUND).send()
}
