import {IUserViewModel} from "../models/userView.model";
import {IMeViewModel} from "../../auth/models/meView.model";
import {IUserDbModel} from "../models/userDb.model";

export const getUserViewModel = (data: IUserDbModel): IUserViewModel => {
    return {
        id: data._id,
        login: data.login,
        email: data.email,
        createdAt: data.createdAt,
    }
}
export const getUserInfo = (user: IUserViewModel): IMeViewModel => {
    return {
        userId: user.id,
        email: user.email,
        login: user.login
    }
}