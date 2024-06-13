import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {IUserInputModel} from "./models/userInput.model";
import {IUserViewModel} from "./models/userView.model";
import {ResultStatus} from "../../common/types/resultStatus.type";
import {StatusCodes} from "http-status-codes";
import {UsersService} from "./service/users.service";
import {IQueryModel} from "../../common/types/query.model";
import {IPaginator} from "../../common/types/paginator";
import {getQueryParams} from "../../common/utils/mappers";
import {UsersQueryRepository} from "./repository/usersQuery.repository";

@injectable()
export class UsersController {

    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {
    }

    async createUser (
        req: Request<{}, {}, IUserInputModel>,
        res: Response<IUserViewModel>
    ){
        const result = await this.usersService.createUser(
            req.body
        )

        result.status === ResultStatus.Success
            ? res.status(StatusCodes.CREATED).send(result.data!)
            : res.status(StatusCodes.NOT_FOUND).json()
    }

    async deleteUser (req: Request<{ id: string }>, res: Response<StatusCodes>) {
        const {id} = req.params
        const result = await this.usersService.deleteUser(id)
        return result.status === ResultStatus.Success ? res.status(StatusCodes.NO_CONTENT).send() : res.status(StatusCodes.NOT_FOUND).send()
    }

    async getUsers (
        req: Request<{}, {}, {}, IQueryModel>,
        res: Response<IPaginator<IUserViewModel>>
    ) {
        const query: IQueryModel = getQueryParams(req.query)
        const result = await this.usersQueryRepository.findUsers(query)
        res.status(StatusCodes.OK).send(result)
    }
}