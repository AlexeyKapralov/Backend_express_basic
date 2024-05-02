import {bcryptService} from '../common/adapters/bcrypt.service'
import {usersRepository} from '../repositories/users/users.repository'
import {ILoginInputModel} from "../features/auth/models/loginInputModel";
import {ResultType} from "../common/types/result.type";
import {ResultStatus} from "../common/types/resultStatus.type";

//TODO: переписать всё на новый тип Result Type
export const loginService = {
    async loginUser(data: ILoginInputModel):Promise<ResultType> {
        const user = await usersRepository.findUserWithPass(data.loginOrEmail)

        if (!user) {
            return {
                data: null,
                status: ResultStatus.NotFound
            }
        } else {
            const isTruehash = await bcryptService.comparePasswordsHash(data.password, user.password)
            return {
                status: isTruehash ? ResultStatus.Success : ResultStatus.BadRequest,
                data: null
            }
        }
    }
}
